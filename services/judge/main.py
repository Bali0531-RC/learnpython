from __future__ import annotations

from typing import List, Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

from runner import (
    ProvidedFile,
    UnsafeCodeError,
    normalize_output,
    run_python_code,
    validate_python_code,
)


app = FastAPI(title="Kodrettsegi Judge", version="0.1.0")


class TestCase(BaseModel):
    input: str = Field(default="")
    expected_output: str
    label: str = Field(default="Teszteset")


class ProvidedFilePayload(BaseModel):
    path: str
    content: str


class EvaluationRequest(BaseModel):
    code: str
    tests: List[TestCase] = Field(default_factory=list)
    files: List[ProvidedFilePayload] = Field(default_factory=list)
    allow_file_io: bool = Field(default=False)
    mode: Literal["run", "submit"] = Field(default="run")


@app.get("/health")
def healthcheck() -> dict[str, object]:
    return {
        "ok": True,
        "service": "kodrettsegi-judge",
        "execution_mode": "strict-exam-slice-1",
    }


@app.post("/evaluate")
def evaluate(payload: EvaluationRequest) -> dict[str, object]:
    tests = payload.tests or [
        TestCase(label="Smoke test", input="2\n3\n", expected_output="5")
    ]
    provided_files = [
        ProvidedFile(path=item.path, content=item.content) for item in payload.files
    ]

    try:
        validate_python_code(payload.code, allow_file_io=payload.allow_file_io)
    except UnsafeCodeError as exc:
        return {
            "ok": True,
            "mode": payload.mode,
            "blocked": True,
            "block_reason": str(exc),
            "resource_exceeded": False,
            "resource_message": None,
            "terminated_early": False,
            "passed": 0,
            "total": 0,
            "score": 0,
            "results": [],
        }

    results = []
    passed = 0
    resource_exceeded = False
    resource_message = None
    terminated_early = False

    for test in tests:
        execution = run_python_code(
            payload.code,
            test.input,
            provided_files=provided_files,
            allow_file_io=payload.allow_file_io,
        )
        actual_output = normalize_output(execution.stdout)
        expected_output = normalize_output(test.expected_output)
        is_match = (
            not execution.timed_out
            and execution.exit_code == 0
            and actual_output == expected_output
        )

        if is_match:
            passed += 1

        results.append(
            {
                "label": test.label,
                "passed": is_match,
                "expected_output": expected_output,
                "actual_output": actual_output,
                "stderr": execution.stderr.strip(),
                "exit_code": execution.exit_code,
                "timed_out": execution.timed_out,
                "resource_exceeded": execution.resource_exceeded,
                "resource_message": execution.resource_message,
            }
        )

        if execution.resource_exceeded:
            resource_exceeded = True
            resource_message = execution.resource_message
            terminated_early = True
            break

    total = len(tests)
    score = round((passed / total) * 100, 2) if total else 0

    return {
        "ok": True,
        "mode": payload.mode,
        "blocked": False,
        "block_reason": None,
        "resource_exceeded": resource_exceeded,
        "resource_message": resource_message,
        "terminated_early": terminated_early,
        "passed": passed,
        "total": total,
        "score": score,
        "results": results,
    }