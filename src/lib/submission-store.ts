import "server-only";

import { db, runWithDatabaseFallback } from "./db";

type StoredJudgeResultRow = {
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

type StoredJudgeEvaluation = {
  score: number;
  passed: number;
  total: number;
  blocked?: boolean;
  block_reason?: string | null;
  resource_exceeded?: boolean;
  resource_message?: string | null;
  terminated_early?: boolean;
  results: StoredJudgeResultRow[];
};

type PersistSubmissionInput = {
  taskId: string;
  mode: "run" | "submit";
  suite: "public" | "hidden";
  outputVisibility: "full" | "masked";
  result: StoredJudgeEvaluation;
};

export async function persistSubmissionIfPossible({
  taskId,
  mode,
  suite,
  outputVisibility,
  result,
}: PersistSubmissionInput) {
  const task = await runWithDatabaseFallback(() =>
    db.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
      },
    }),
  );

  if (!task) {
    return;
  }

  await runWithDatabaseFallback(() =>
    db.submission.create({
      data: {
        taskId,
        mode,
        suite,
        outputVisibility,
        score: result.score,
        passed: result.passed,
        total: result.total,
        blocked: result.blocked ?? false,
        blockReason: result.block_reason ?? null,
        resourceExceeded: result.resource_exceeded ?? false,
        resourceMessage: result.resource_message ?? null,
        terminatedEarly: result.terminated_early ?? false,
        results: {
          create: result.results.map((row, index) => ({
            position: index,
            label: row.label,
            passed: row.passed,
            expectedOutput: row.expected_output,
            actualOutput: row.actual_output,
            stderr: row.stderr,
            exitCode: row.exit_code,
            timedOut: row.timed_out,
            resourceExceeded: row.resource_exceeded ?? false,
            resourceMessage: row.resource_message ?? null,
          })),
        },
      },
    }),
  );
}