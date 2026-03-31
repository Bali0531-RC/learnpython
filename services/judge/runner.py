from __future__ import annotations

import ast
from dataclasses import dataclass
from pathlib import Path
import resource
import signal
import subprocess
import sys
import tempfile


MAX_CODE_CHARS = 16_000
MAX_CAPTURE_CHARS = 4_000
CONTAINER_MEMORY_LIMIT_BYTES = 2 * 1024 * 1024 * 1024
RUNNER_MEMORY_LIMIT_BYTES = CONTAINER_MEMORY_LIMIT_BYTES - (512 * 1024 * 1024)
STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024
CPU_LIMIT_SECONDS = 2
FILE_LIMIT_BYTES = STORAGE_LIMIT_BYTES
PROCESS_LIMIT = 1

RESOURCE_LIMIT_MESSAGE = (
    "A futtatást a sandbox leállította, mert túllépte az erőforráskeretet: "
    "legfeljebb 1 CPU-mag, 2 GB RAM és 5 GB írható tárhely használható."
)
CPU_LIMIT_MESSAGE = (
    f"{RESOURCE_LIMIT_MESSAGE} A program túl sokáig foglalta a processzort."
)
MEMORY_LIMIT_MESSAGE = (
    f"{RESOURCE_LIMIT_MESSAGE} A program túl sok memóriát próbált használni."
)
STORAGE_LIMIT_MESSAGE = (
    f"{RESOURCE_LIMIT_MESSAGE} A futás túllépte az írható tárhely keretét."
)

BLOCKED_CALLS = {
    "breakpoint",
    "compile",
    "eval",
    "exec",
    "exit",
    "getattr",
    "globals",
    "help",
    "locals",
    "open",
    "quit",
    "setattr",
    "vars",
}


class UnsafeCodeError(ValueError):
    pass


@dataclass
class ProvidedFile:
    path: str
    content: str


@dataclass
class ExecutionResult:
    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool
    resource_exceeded: bool = False
    resource_message: str | None = None


class SafetyVisitor(ast.NodeVisitor):
    def __init__(self, allow_file_io: bool = False):
        self.allow_file_io = allow_file_io

    def visit_Import(self, node: ast.Import) -> None:
        raise UnsafeCodeError(
            "Import használata ebben a vizsgamódban nem engedélyezett. Oldd meg a feladatot beépített Python-eszközökkel."
        )

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        raise UnsafeCodeError(
            "Import használata ebben a vizsgamódban nem engedélyezett. Oldd meg a feladatot beépített Python-eszközökkel."
        )

    def visit_Attribute(self, node: ast.Attribute) -> None:
        if node.attr.startswith("__"):
            raise UnsafeCodeError(
                "Dunder attribútumok nem használhatók a sandboxolt vizsgamódban."
            )

        self.generic_visit(node)

    def visit_Name(self, node: ast.Name) -> None:
        if node.id.startswith("__") and node.id != "__name__":
            raise UnsafeCodeError(
                "A judge nem engedélyezi a belső Python-objektumok közvetlen elérését."
            )

        self.generic_visit(node)

    def visit_Call(self, node: ast.Call) -> None:
        called_name = _resolve_called_name(node.func)

        if called_name == "open" and self.allow_file_io:
            self.generic_visit(node)
            return

        if called_name in BLOCKED_CALLS:
            raise UnsafeCodeError(
                f"A {called_name} használata ebben a vizsgamódban tiltott. A feladat standard inputra és outputra épül."
            )

        self.generic_visit(node)


def validate_python_code(code: str, allow_file_io: bool = False) -> None:
    if len(code) > MAX_CODE_CHARS:
        raise UnsafeCodeError(
            "A beküldött kód túl nagy ehhez az első, szigorított vizsgamódhoz."
        )

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return

    SafetyVisitor(allow_file_io=allow_file_io).visit(tree)


def _resolve_called_name(node: ast.expr) -> str | None:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return node.attr
    return None


def _truncate_stream(stream: str, limit: int = MAX_CAPTURE_CHARS) -> str:
    if len(stream) <= limit:
        return stream

    omitted = len(stream) - limit
    return f"{stream[:limit]}\n...[levagva: {omitted} karakter]"


def _set_limit(limit: int, soft: int, hard: int) -> None:
    try:
        resource.setrlimit(limit, (soft, hard))
    except (OSError, ValueError):
        return


def _apply_resource_limits() -> None:
    _set_limit(resource.RLIMIT_CPU, CPU_LIMIT_SECONDS, CPU_LIMIT_SECONDS)
    _set_limit(resource.RLIMIT_AS, RUNNER_MEMORY_LIMIT_BYTES, RUNNER_MEMORY_LIMIT_BYTES)
    _set_limit(resource.RLIMIT_FSIZE, FILE_LIMIT_BYTES, FILE_LIMIT_BYTES)
    _set_limit(resource.RLIMIT_CORE, 0, 0)

    if hasattr(resource, "RLIMIT_NPROC"):
        _set_limit(resource.RLIMIT_NPROC, PROCESS_LIMIT, PROCESS_LIMIT)


def _sanitize_relative_path(file_path: str) -> str:
    normalized = Path(file_path)

    if normalized.is_absolute() or ".." in normalized.parts:
        raise UnsafeCodeError("Csak relatív, a feladathoz tartozó fájlok használhatók.")

    return normalized.as_posix().lstrip("./")


def _write_provided_files(base_dir: Path, provided_files: list[ProvidedFile]) -> set[str]:
    written_files: set[str] = set()

    for file in provided_files:
        relative_path = _sanitize_relative_path(file.path)
        target_path = base_dir / relative_path
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(file.content, encoding="utf-8")
        written_files.add(relative_path)

    return written_files


def _build_fileio_bootstrap(allowed_files: set[str]) -> str:
    return "\n".join(
        [
            "from pathlib import Path",
            "import builtins",
            f"_ALLOWED_FILES = {sorted(allowed_files)!r}",
            "_REAL_OPEN = builtins.open",
            "_BASE = Path.cwd().resolve()",
            "",
            "def _safe_open(file, mode='r', *args, **kwargs):",
            "    candidate = Path(file)",
            "    if candidate.is_absolute():",
            "        raise PermissionError('Csak a feladathoz adott fájlok olvashatók.')",
            "    resolved = (_BASE / candidate).resolve()",
            "    try:",
            "        relative = resolved.relative_to(_BASE).as_posix()",
            "    except ValueError as exc:",
            "        raise PermissionError('Érvénytelen fájlútvonal.') from exc",
            "    if relative not in _ALLOWED_FILES:",
            "        raise PermissionError('Ez a fájl nincs becsatolva ehhez a feladathoz.')",
            "    if any(flag in mode for flag in ('w', 'a', 'x', '+')):",
            "        raise PermissionError('A fájlos vizsgamódban csak olvasás engedélyezett.')",
            "    return _REAL_OPEN(resolved, mode, *args, **kwargs)",
            "",
            "builtins.open = _safe_open",
            "globals_dict = {'__name__': '__main__'}",
            "with _REAL_OPEN('submission_user.py', encoding='utf-8') as handle:",
            "    source = handle.read()",
            "exec(compile(source, 'submission.py', 'exec'), globals_dict)",
        ]
    )


def _detect_resource_exceeded(return_code: int, stderr: str) -> str | None:
    lowered = stderr.lower()

    if "memoryerror" in lowered or "cannot allocate memory" in lowered or "out of memory" in lowered:
        return MEMORY_LIMIT_MESSAGE

    if "no space left on device" in lowered or "file too large" in lowered:
        return STORAGE_LIMIT_MESSAGE

    sigxcpu = getattr(signal, "SIGXCPU", None)
    sigxfsz = getattr(signal, "SIGXFSZ", None)

    if sigxcpu is not None and return_code == -sigxcpu:
        return CPU_LIMIT_MESSAGE

    if sigxfsz is not None and return_code == -sigxfsz:
        return STORAGE_LIMIT_MESSAGE

    if return_code == -signal.SIGKILL:
        return RESOURCE_LIMIT_MESSAGE

    return None


def run_python_code(
    code: str,
    stdin: str,
    timeout_seconds: float = 2.0,
    provided_files: list[ProvidedFile] | None = None,
    allow_file_io: bool = False,
) -> ExecutionResult:
    with tempfile.TemporaryDirectory(prefix="judge-") as temp_dir:
        temp_path = Path(temp_dir)
        entry_script_path = temp_path / "submission.py"

        if allow_file_io:
            allowed_files = _write_provided_files(temp_path, provided_files or [])
            user_script_path = temp_path / "submission_user.py"
            user_script_path.write_text(code, encoding="utf-8")
            entry_script_path.write_text(
                _build_fileio_bootstrap(allowed_files),
                encoding="utf-8",
            )
        else:
            entry_script_path.write_text(code, encoding="utf-8")

        try:
            completed = subprocess.run(
                [sys.executable, "-I", "-S", "-B", str(entry_script_path)],
                input=stdin,
                capture_output=True,
                cwd=temp_dir,
                text=True,
                timeout=timeout_seconds,
                check=False,
                env={
                    "PYTHONIOENCODING": "utf-8",
                    "PYTHONUNBUFFERED": "1",
                },
                preexec_fn=_apply_resource_limits,
            )
        except subprocess.TimeoutExpired as exc:
            return ExecutionResult(
                stdout=_truncate_stream(exc.stdout or ""),
                stderr=_truncate_stream(exc.stderr or CPU_LIMIT_MESSAGE),
                exit_code=-1,
                timed_out=True,
                resource_exceeded=True,
                resource_message=CPU_LIMIT_MESSAGE,
            )

        resource_message = _detect_resource_exceeded(
            completed.returncode,
            completed.stderr,
        )

        return ExecutionResult(
            stdout=_truncate_stream(completed.stdout),
            stderr=_truncate_stream(completed.stderr),
            exit_code=completed.returncode,
            timed_out=False,
            resource_exceeded=resource_message is not None,
            resource_message=resource_message,
        )


def normalize_output(output: str) -> str:
    lines = [line.rstrip() for line in output.replace("\r\n", "\n").split("\n")]
    return "\n".join(lines).strip()