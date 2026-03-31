import { getWorkspaceTaskContent } from "@/lib/content-store";
import { persistSubmissionIfPossible } from "@/lib/submission-store";
import type { TaskTestCase, WorkspaceTask } from "@/lib/task-types";

type JudgeSuite = "public" | "hidden";
type OutputVisibility = "full" | "masked";

type JudgeTestCase = {
  input: string;
  expected_output: string;
  label?: string;
};

type JudgeProvidedFile = {
  path: string;
  content: string;
};

type SubmissionPayload = {
  code: string;
  taskId?: string;
  track?: "kozep" | "emelt";
  mode?: "run" | "submit";
};

type JudgeResultRow = {
  label: string;
  passed: boolean;
  expected_output: string;
  actual_output: string;
  stderr: string;
  exit_code: number;
  timed_out: boolean;
  resource_exceeded?: boolean;
  resource_message?: string | null;
};

type JudgeEvaluation = {
  ok: boolean;
  mode: "run" | "submit";
  passed: number;
  total: number;
  score: number;
  blocked?: boolean;
  block_reason?: string | null;
  resource_exceeded?: boolean;
  resource_message?: string | null;
  terminated_early?: boolean;
  results: JudgeResultRow[];
};

function selectTests(task: WorkspaceTask, mode: "run" | "submit") {
  const hiddenTests = task.hiddenTests ?? [];

  if (mode === "submit" && hiddenTests.length > 0) {
    return {
      suite: "hidden" as JudgeSuite,
      outputVisibility: "masked" as OutputVisibility,
      tests: hiddenTests,
    };
  }

  return {
    suite: "public" as JudgeSuite,
    outputVisibility: "full" as OutputVisibility,
    tests: task.publicTests,
  };
}

function toJudgeTests(tests: TaskTestCase[]): JudgeTestCase[] {
  return tests.map((test) => ({
    label: test.label,
    input: test.input,
    expected_output: test.expectedOutput,
  }));
}

function maskHiddenSuiteResult(result: JudgeEvaluation): JudgeEvaluation {
  return {
    ...result,
    results: result.results.map((row, index) => ({
      ...row,
      label: `Rejtett teszt ${index + 1}`,
      expected_output: "",
      actual_output: "",
    })),
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as SubmissionPayload;
  const mode = body.mode ?? "run";

  if (!body.code?.trim()) {
    return Response.json(
      { ok: false, error: "Kód nélkül nem indulhat beküldés." },
      { status: 400 },
    );
  }

  if (!body.taskId) {
    return Response.json(
      { ok: false, error: "A beküldéshez ismert feladatazonosító szükséges." },
      { status: 400 },
    );
  }

  const task = await getWorkspaceTaskContent(body.taskId);

  if (!task) {
    return Response.json(
      { ok: false, error: "A kért feladat nem található a gyakorlóbankban vagy az archívumban." },
      { status: 404 },
    );
  }

  const judgeUrl = process.env.JUDGE_API_URL ?? "http://127.0.0.1:8001";
  const selected = selectTests(task, mode);
  const tests = toJudgeTests(selected.tests);
  const files: JudgeProvidedFile[] = (task.providedFiles ?? []).map((file) => ({
    path: file.path,
    content: file.content,
  }));

  try {
    const response = await fetch(`${judgeUrl}/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: body.code,
        mode,
        tests,
        files,
        allow_file_io: task.inputMode === "provided-files",
      }),
    });

    if (!response.ok) {
      return Response.json(
        {
          ok: false,
          error: "A judge service hibával válaszolt.",
          status: response.status,
        },
        { status: 502 },
      );
    }

    const rawResult = (await response.json()) as JudgeEvaluation;
    const result = selected.outputVisibility === "masked"
      ? maskHiddenSuiteResult(rawResult)
      : rawResult;

    await persistSubmissionIfPossible({
      taskId: task.id,
      mode,
      suite: selected.suite,
      outputVisibility: selected.outputVisibility,
      result,
    });

    return Response.json({
      ok: true,
      taskId: task.id,
      taskTitle: task.title,
      track: task.track,
      mode,
      suite: selected.suite,
      outputVisibility: selected.outputVisibility,
      result,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        error:
          "A judge service jelenleg nem érhető el. A submission gateway készen áll, de a külső evaluator nem fut.",
      },
      { status: 503 },
    );
  }
}