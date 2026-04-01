"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  AiReviewQuota,
  AiReviewResult,
  AiReviewRouteResponse,
  AiReviewVerdictInput,
} from "@/lib/ai-review-types";
import type { WorkspaceTask } from "@/lib/task-types";
import {
  appendTaskAiReview,
  appendWorkspaceHistory,
  clearTaskDraft,
  formatLocalTimestamp,
  listTaskAiReviews,
  listTaskHistory,
  loadTaskDraft,
  saveTaskDraft,
  type StoredAiReviewRecord,
  type StoredVerdictRecord,
} from "@/lib/workspace-storage";

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

type SubmissionResponse = {
  ok: boolean;
  taskId: string | null;
  track: string | null;
  mode: "run" | "submit";
  suite: "public" | "hidden";
  outputVisibility: "full" | "masked";
  taskTitle: string;
  result: JudgeEvaluation;
  error?: string;
};

function toAiReviewInput(verdict: SubmissionResponse): AiReviewVerdictInput {
  return {
    mode: verdict.mode,
    suite: verdict.suite,
    outputVisibility: verdict.outputVisibility,
    score: verdict.result.score,
    passed: verdict.result.passed,
    total: verdict.result.total,
    blocked: Boolean(verdict.result.blocked),
    blockReason: verdict.result.block_reason ?? null,
    resourceExceeded: verdict.result.resource_exceeded ?? false,
    resourceMessage: verdict.result.resource_message ?? null,
    terminatedEarly: verdict.result.terminated_early ?? false,
    results: verdict.result.results.map((result) => ({
      label: result.label,
      passed: result.passed,
      expectedOutput: verdict.outputVisibility === "full" ? result.expected_output : undefined,
      actualOutput: verdict.outputVisibility === "full" ? result.actual_output : undefined,
      stderr: result.stderr,
      timedOut: result.timed_out,
      resourceExceeded: result.resource_exceeded ?? false,
      resourceMessage: result.resource_message ?? null,
    })),
  };
}

function toStoredAiReviewRecord(options: {
  task: WorkspaceTask;
  taskPath: string;
  review: AiReviewResult;
}): StoredAiReviewRecord {
  const { review, task, taskPath } = options;

  return {
    id: crypto.randomUUID(),
    taskId: task.id,
    taskPath,
    taskTitle: task.title,
    track: task.track,
    level: task.level,
    family: task.family,
    sourceKind: task.source.kind,
    mode: review.basedOn.mode,
    suite: review.basedOn.suite,
    reviewScore: review.score,
    judgeScore: review.basedOn.judgeScore,
    summary: review.summary,
    strengths: review.strengths,
    findings: review.findings,
    tips: review.tips,
    nextStep: review.nextStep,
    improvedExample: review.improvedExample,
    createdAt: review.createdAt,
  };
}

export function TaskWorkspace({ task }: { task: WorkspaceTask }) {
  const [code, setCode] = useState(task.starterCode);
  const [verdict, setVerdict] = useState<SubmissionResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<"run" | "submit" | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(null);
  const [history, setHistory] = useState<StoredVerdictRecord[]>([]);
  const [aiReviewHistory, setAiReviewHistory] = useState<StoredAiReviewRecord[]>([]);
  const [aiReview, setAiReview] = useState<AiReviewResult | null>(null);
  const [aiReviewError, setAiReviewError] = useState<string | null>(null);
  const [aiReviewQuota, setAiReviewQuota] = useState<AiReviewQuota | null>(null);
  const [aiReviewAvailable, setAiReviewAvailable] = useState(false);
  const [aiReviewAvailabilityMessage, setAiReviewAvailabilityMessage] = useState<string | null>(null);
  const [isAiReviewPending, setIsAiReviewPending] = useState(false);
  const [lastJudgedCode, setLastJudgedCode] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [hasEditedDraft, setHasEditedDraft] = useState(false);

  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const hasHiddenTests = (task.hiddenTests?.length ?? 0) > 0;
  const taskPath = useMemo(
    () =>
      task.source.kind === "official-archive"
        ? `/vizsgaarchivum/${task.id}`
        : `/gyakorlas/${task.id}`,
    [task.id, task.source.kind],
  );
  const codeDiffersFromLastVerdict = Boolean(
    verdict && lastJudgedCode !== null && code !== lastJudgedCode,
  );
  const canRequestAiReview =
    Boolean(verdict) &&
    Boolean(lastJudgedCode?.trim()) &&
    aiReviewAvailable &&
    !isPending &&
    !isAiReviewPending &&
    (aiReviewQuota?.remaining ?? 1) > 0;

  useEffect(() => {
    const storedDraft = loadTaskDraft(task.id);

    setCode(storedDraft?.code ?? task.starterCode);
    setDraftUpdatedAt(storedDraft?.updatedAt ?? null);
    setHistory(listTaskHistory(task.id).slice(0, 6));
    setAiReviewHistory(listTaskAiReviews(task.id).slice(0, 4));
    setAiReview(null);
    setAiReviewError(null);
    setAiReviewQuota(null);
    setAiReviewAvailable(false);
    setAiReviewAvailabilityMessage(null);
    setIsAiReviewPending(false);
    setLastJudgedCode(null);
    setVerdict(null);
    setRequestError(null);
    setActiveMode(null);
    setHasEditedDraft(false);
    setStorageReady(true);
  }, [task.id, task.starterCode]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAiReviewStatus() {
      try {
        const response = await fetch("/api/ai-review", {
          method: "GET",
          cache: "no-store",
        });
        const data = (await response.json()) as AiReviewRouteResponse;

        if (isCancelled) {
          return;
        }

        setAiReviewAvailable(Boolean(data.available));
        setAiReviewQuota(data.quota ?? null);
        setAiReviewAvailabilityMessage(data.available ? null : data.error ?? null);
      } catch {
        if (isCancelled) {
          return;
        }

        setAiReviewAvailable(false);
        setAiReviewQuota(null);
        setAiReviewAvailabilityMessage(
          "Az AI review állapota most nem olvasható ki a szerverről.",
        );
      }
    }

    void loadAiReviewStatus();

    return () => {
      isCancelled = true;
    };
  }, [task.id]);

  useEffect(() => {
    if (!storageReady || !hasEditedDraft) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (code === task.starterCode) {
        clearTaskDraft(task.id);
        setDraftUpdatedAt(null);
        return;
      }

      const savedDraft = saveTaskDraft({
        taskId: task.id,
        taskPath,
        taskTitle: task.title,
        track: task.track,
        level: task.level,
        family: task.family,
        sourceKind: task.source.kind,
        code,
        updatedAt: new Date().toISOString(),
      });

      setDraftUpdatedAt(savedDraft.updatedAt);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [
    code,
    hasEditedDraft,
    storageReady,
    task.family,
    task.id,
    task.level,
    task.source.kind,
    task.starterCode,
    task.title,
    task.track,
    taskPath,
  ]);

  function handleCodeChange(nextCode: string) {
    setCode(nextCode);
    setHasEditedDraft(true);
  }

  function handleResetDraft() {
    clearTaskDraft(task.id);
    setCode(task.starterCode);
    setDraftUpdatedAt(null);
    setHasEditedDraft(false);
  }

  async function handleJudge(mode: "run" | "submit") {
    if (!code.trim()) {
      setRequestError("A kódszerkesztő jelenleg üres, így nincs mit futtatni.");
      setVerdict(null);
      return;
    }

    setIsPending(true);
    setActiveMode(mode);
    setRequestError(null);
    setAiReviewError(null);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          taskId: task.id,
          track: task.track,
          mode,
        }),
      });

      const data = (await response.json()) as SubmissionResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "A beküldés nem ért célba.");
      }

      setVerdict(data);
      setLastJudgedCode(code);
      setAiReview(null);
      setHistory(
        appendWorkspaceHistory({
          id: crypto.randomUUID(),
          taskId: task.id,
          taskPath,
          taskTitle: task.title,
          track: task.track,
          level: task.level,
          family: task.family,
          sourceKind: task.source.kind,
          mode: data.mode,
          suite: data.suite,
          outputVisibility: data.outputVisibility,
          score: data.result.score,
          passed: data.result.passed,
          total: data.result.total,
          blocked: Boolean(data.result.blocked),
          createdAt: new Date().toISOString(),
        })
          .filter((entry) => entry.taskId === task.id)
          .slice(0, 6),
      );
    } catch (error) {
      setVerdict(null);
      setRequestError(
        error instanceof Error
          ? error.message
          : "Ismeretlen hiba történt a judge hívásakor.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleAiReview() {
    if (!verdict || !lastJudgedCode?.trim()) {
      setAiReviewError(
        "AI review csak már lefuttatott vagy beküldött kódhoz kérhető. Előbb indíts egy judge futást.",
      );
      return;
    }

    setIsAiReviewPending(true);
    setAiReviewError(null);

    try {
      const response = await fetch("/api/ai-review", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: task.id,
          code: lastJudgedCode,
          verdict: toAiReviewInput(verdict),
        }),
      });

      const data = (await response.json()) as AiReviewRouteResponse;

      setAiReviewAvailable(Boolean(data.available));
      setAiReviewQuota(data.quota ?? null);
      setAiReviewAvailabilityMessage(data.available ? null : data.error ?? null);

      if (!response.ok || !data.ok || !data.review) {
        throw new Error(data.error ?? "Az AI review nem adott használható választ.");
      }

      setAiReview(data.review);
      setAiReviewHistory(
        appendTaskAiReview(
          toStoredAiReviewRecord({
            task,
            taskPath,
            review: data.review,
          }),
        )
          .filter((entry) => entry.taskId === task.id)
          .slice(0, 4),
      );
    } catch (error) {
      setAiReviewError(
        error instanceof Error
          ? error.message
          : "Ismeretlen hiba történt az AI review kérésekor.",
      );
    } finally {
      setIsAiReviewPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="section-card p-7 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip">{task.level}</span>
          <span className="chip">{task.family}</span>
          <span className="chip">{task.estimatedMinutes}</span>
          <span className="chip">{task.source.label}</span>
          <span className="chip">
            {task.inputMode === "provided-files" ? "Fájlból olvas" : "Standard input"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="eyebrow">Feladatlap</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {task.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
              {task.summary}
            </p>
            <p className="mt-4 rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
              {task.source.note}
            </p>
          </div>

          <div className="grid gap-5">
            {task.statement.map((block) => (
              <article key={block.title} className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                <h3 className="text-lg font-semibold tracking-tight">{block.title}</h3>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--foreground)]">
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {block.bullets ? (
                  <ul className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-sm leading-6 text-[var(--muted)]">
                    {block.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-2">
            <article className="min-w-0 rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <p className="eyebrow">Bemenet</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {task.inputFormat.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>

            <article className="min-w-0 rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <p className="eyebrow">Kimenet</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {task.outputFormat.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          </div>

          {task.providedFiles?.length ? (
            <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="eyebrow">Munkafájlok</p>
                <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  előnézet scrollal
                </span>
              </div>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {task.providedFiles.map((file) => (
                  <div key={file.path} className="min-w-0 rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold tracking-tight">{file.path}</h3>
                      <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        automatikusan csatolva
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {file.description}
                    </p>
                    <pre className="mt-3 max-h-[26rem] overflow-auto rounded-2xl bg-[#151515] px-4 py-3 font-mono text-sm leading-6 text-[#f8efe1]">
                      {file.content}
                    </pre>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
            <p className="eyebrow">Publikus tesztek</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {hasHiddenTests
                ? `A Futtatás ezeket a látható mintákat használja. A Pontozott beküldés külön ${task.hiddenTests?.length} darab rejtett ellenőrzéssel pontoz.`
                : "Ehhez a feladathoz jelenleg csak publikus mintacsomag tartozik, ezért a pontozott beküldés is ugyanezt használja."}
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {task.publicTests.map((test) => (
                <section key={test.label} className="min-w-0 rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <h3 className="text-base font-semibold">{test.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {test.explanation}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                        Bemenet
                      </p>
                      <pre className="mt-2 max-h-40 overflow-auto rounded-2xl bg-[#151515] px-4 py-3 font-mono text-sm leading-6 text-[#f8efe1]">
                        {test.input}
                      </pre>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                        Elvárt kimenet
                      </p>
                      <pre className="mt-2 max-h-[28rem] overflow-auto rounded-2xl bg-[#151515] px-4 py-3 font-mono text-sm leading-6 text-[#f8efe1]">
                        {test.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-card p-7 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Kódszerkesztő</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Vizsgamód munkafelület
            </h2>
          </div>
          <span className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
            {lineCount} sor
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
            <p className="eyebrow">Induló súgó</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {task.editorTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
            <p className="eyebrow">Futtatási mód</p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {task.inputMode === "provided-files"
                ? "Ez a feladat fájlos. A szükséges állományok már bent vannak a sandboxban, így csak olvasni kell őket."
                : "Ez a feladat standard bemenetre épül. A judge a publikus teszteket ugyanazzal a stdin/stdout modellel futtatja."}
            </p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {hasHiddenTests
                ? "A futtatás gyors, látható mintákkal ellenőriz. A pontozott beküldés ugyanarra a judge-ra megy, de külön rejtett tesztcsomaggal, ezért ott a részletes elvárt kimenet már nem látszik."
                : "Ehhez a feladathoz a pontozott beküldés még ugyanazzal a publikus csomaggal dolgozik. A következő körben külön rejtett tesztek és submission history jönnek."}
            </p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              A sandbox legfeljebb 1 CPU-magot, 2 GB memóriát és 5 GB írható területet használhat. Ha a kód ezt túllépi, a judge megszakítja a futást, és külön figyelmeztetést jelenít meg.
            </p>
          </article>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[#111418] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-[#bdc7d0]">
            <span>{task.inputMode === "provided-files" ? "sebesseg.py" : "main.py"}</span>
            <span>{task.inputMode === "provided-files" ? "provided files" : "stdin / stdout"}</span>
          </div>
          <textarea
            className="min-h-[420px] w-full resize-y bg-transparent px-4 py-4 font-mono text-sm leading-7 text-[#f3eadf] outline-none"
            spellCheck={false}
            value={code}
            onChange={(event) => handleCodeChange(event.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Ha még teljesen kezdő vagy, nyugodtan töröld a teljes vázlatot, és írd meg a megoldást a saját stílusodban. A starter csak támpont, nem kötelező sablon.
          </p>
          <div className="flex flex-wrap gap-3">
            {storageReady ? (
              <button
                className="secondary-link cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                disabled={code === task.starterCode && !draftUpdatedAt}
                type="button"
                onClick={handleResetDraft}
              >
                Alap vázlat visszaállítása
              </button>
            ) : null}
            <button
              className="secondary-link cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              type="button"
              onClick={() => handleJudge("run")}
            >
              {isPending && activeMode === "run" ? "Futtatás..." : "Futtatás"}
            </button>
            <button
              className="primary-link cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              type="button"
              onClick={() => handleJudge("submit")}
            >
              {isPending && activeMode === "submit"
                ? "Beküldés..."
                : "Pontozott beküldés"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
            <p className="eyebrow">Piszkozatállapot</p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {storageReady && draftUpdatedAt
                ? `Utolsó automatikus mentés: ${formatLocalTimestamp(draftUpdatedAt)}.`
                : "A kód módosítás után automatikusan helyben mentődik ebben a böngészőben."}
            </p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Az alap vázlatra visszaállítás törli a helyben mentett draftot is ennél a feladatnál.
            </p>
          </article>

          <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
            <p className="eyebrow">Legutóbbi próbák</p>
            {history.length ? (
              <div className="mt-4 space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold tracking-tight">
                        {entry.mode === "run" ? "Futtatás" : "Pontozott beküldés"}
                      </p>
                      <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        {formatLocalTimestamp(entry.createdAt)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm leading-6 text-[var(--muted)]">
                      <span>{entry.suite === "hidden" ? "Rejtett suite" : "Publikus suite"}</span>
                      <span>{entry.passed}/{entry.total}</span>
                      <span>{entry.score}%</span>
                      {entry.blocked ? <span>blokkolva</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Még nincs sikeresen visszaérkező futás vagy beküldés ennél a feladatnál.
              </p>
            )}
          </article>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {task.workspaceRules.map((rule) => (
            <article key={rule.title} className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <h3 className="font-semibold">{rule.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {rule.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card p-7 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Verdikt</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Futtatási eredmény és tesztesetek
            </h2>
          </div>
          {verdict ? (
            <span className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
              {verdict.mode === "run" ? "Futtatás" : "Beküldés"} · {verdict.result.score}%
            </span>
          ) : null}
        </div>

        {requestError ? (
          <div className="mt-6 rounded-3xl border border-[#c54d2f]/30 bg-[#c54d2f]/10 px-5 py-4 text-sm leading-6 text-[#7d2616] dark:text-[#ffc7bc]">
            {requestError}
          </div>
        ) : null}

        {!verdict && !requestError ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface-soft)] px-5 py-6 text-sm leading-6 text-[var(--muted)]">
            A verdict panel a futtatás vagy a pontozott beküldés után tölti be a részletes teszteredményeket.
          </div>
        ) : null}

        {verdict ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Átment tesztek
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {verdict.result.passed}/{verdict.result.total}
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Pontszám
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--accent)]">
                  {verdict.result.score}%
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Tesztcsomag
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {verdict.suite === "hidden" ? "Rejtett" : "Publikus"}
                </p>
              </article>
            </div>

            {verdict.suite === "hidden" ? (
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] px-5 py-4 text-sm leading-6 text-[var(--muted)]">
                A pontozott beküldés rejtett tesztekkel futott. A konkrét bemeneteket és elvárt kimeneteket nem jelenítjük meg, hogy a scored útvonal valóban külön maradjon a futtatástól.
              </div>
            ) : null}

            {verdict.result.resource_exceeded ? (
              <div className="rounded-3xl border border-[#d97706]/30 bg-[#d97706]/10 px-5 py-4 text-sm leading-6 text-[#8a4b06] dark:text-[#ffd7aa]">
                {verdict.result.resource_message ?? "A sandbox leállította a futtatást, mert az elérte az erőforráskeretet."}
                {verdict.result.terminated_early ? " A további teszteket a judge már nem futtatta le." : ""}
              </div>
            ) : null}

            {verdict.result.blocked ? (
              <div className="rounded-3xl border border-[#c54d2f]/30 bg-[#c54d2f]/10 px-5 py-4 text-sm leading-6 text-[#7d2616] dark:text-[#ffc7bc]">
                {verdict.result.block_reason ?? "A kódot a biztonsági ellenőrzés megállította."}
              </div>
            ) : null}

            <div className="grid gap-4">
              {verdict.result.results.map((result) => (
                <article key={result.label} className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {result.label}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                        result.resource_exceeded
                          ? "bg-[#d97706]/12 text-[#8a4b06] dark:text-[#ffd7aa]"
                          : result.timed_out
                            ? "bg-[#d97706]/12 text-[#8a4b06] dark:text-[#ffd7aa]"
                            : result.passed
                              ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                              : "bg-[#c54d2f]/12 text-[#8e2c18] dark:text-[#ffc7bc]"
                      }`}
                    >
                      {result.resource_exceeded
                        ? "Erőforráslimit"
                        : result.timed_out
                          ? "Időtúllépés"
                          : result.passed
                            ? "Megfelelt"
                            : "Eltérés"}
                    </span>
                  </div>
                  {verdict.outputVisibility === "full" ? (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                          Elvárt kimenet
                        </p>
                        <pre className="mt-2 max-h-[24rem] overflow-auto rounded-2xl bg-[#151515] px-4 py-3 font-mono text-sm leading-6 text-[#f8efe1]">
                          {result.expected_output || "(üres kimenet)"}
                        </pre>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                          Tényleges kimenet
                        </p>
                        <pre className="mt-2 max-h-[24rem] overflow-auto rounded-2xl bg-[#151515] px-4 py-3 font-mono text-sm leading-6 text-[#f8efe1]">
                          {result.actual_output || "(üres kimenet)"}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                      Ennél a rejtett tesztnél a konkrét input és output nem látható. A státusz, az időtúllépés és az esetleges futási hiba ettől még megjelenik.
                    </div>
                  )}
                  {result.stderr ? (
                    <div className="mt-4 rounded-2xl border border-[#c54d2f]/20 bg-[#c54d2f]/8 px-4 py-3 text-sm leading-6 text-[#8e2c18] dark:text-[#ffc7bc]">
                      <strong>stderr:</strong> {result.stderr}
                    </div>
                  ) : null}
                  {result.resource_exceeded && result.resource_message ? (
                    <div className="mt-4 rounded-2xl border border-[#d97706]/30 bg-[#d97706]/10 px-4 py-3 text-sm leading-6 text-[#8a4b06] dark:text-[#ffd7aa]">
                      {result.resource_message}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="section-card p-7 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">AI review</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              OpenAI kódreview a submissionhöz
            </h2>
          </div>
          {aiReviewQuota ? (
            <span className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
              {aiReviewQuota.remaining}/{aiReviewQuota.limit} maradt
            </span>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
            <p className="text-sm leading-6 text-[var(--muted)]">
              Az AI review az utolsó judge-olt kódváltozatot és a legutóbbi verdictet elemzi magyar nyelvű visszajelzéssel. A szerveroldali keret böngészőnként legfeljebb 20 kérés.
            </p>
            {codeDiffersFromLastVerdict ? (
              <p className="mt-4 rounded-2xl border border-[#d97706]/30 bg-[#d97706]/10 px-4 py-3 text-sm leading-6 text-[#8a4b06] dark:text-[#ffd7aa]">
                Az editor tartalma már eltér az utolsó futtatott verziótól. Az AI review most még a legutóbbi judge-olt kódot értékeli. Ha az új módosításokra is szeretnél review-t, futtasd újra a megoldást.
              </p>
            ) : null}
            {!verdict ? (
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Előbb futtasd vagy küldd be a megoldást, hogy legyen judge eredmény, amihez az AI reviewer igazodni tud.
              </p>
            ) : null}
            {!aiReviewAvailable ? (
              <p className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {aiReviewAvailabilityMessage ??
                  "Az AI review jelenleg nincs teljesen bekötve ezen a környezeten."}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="primary-link cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canRequestAiReview}
                type="button"
                onClick={handleAiReview}
              >
                {isAiReviewPending ? "AI review készül..." : "AI review kérése"}
              </button>
              {verdict ? (
                <span className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
                  Judge: {verdict.result.score}% · {verdict.suite === "hidden" ? "rejtett suite" : "publikus suite"}
                </span>
              ) : null}
            </div>
          </div>

          {aiReviewError ? (
            <div className="rounded-3xl border border-[#c54d2f]/30 bg-[#c54d2f]/10 px-5 py-4 text-sm leading-6 text-[#7d2616] dark:text-[#ffc7bc]">
              {aiReviewError}
            </div>
          ) : null}

          {aiReview ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    AI pontszám
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--accent)]">
                    {aiReview.score}/100
                  </p>
                </article>
                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Judge alap
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {aiReview.basedOn.judgeScore}%
                  </p>
                </article>
                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Review ideje
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-tight">
                    {formatLocalTimestamp(aiReview.createdAt)}
                  </p>
                </article>
              </div>

              <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                <p className="eyebrow">Összkép</p>
                <p className="mt-3 text-base leading-7 text-[var(--foreground)]">
                  {aiReview.summary}
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  Modell: {aiReview.model}
                  {aiReview.requestId ? ` · request id: ${aiReview.requestId}` : ""}
                </p>
              </article>

              <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="eyebrow">Erősségek</p>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground)]">
                    {aiReview.strengths.map((strength) => (
                      <li key={strength} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="eyebrow">Kockázatok</p>
                  <div className="mt-4 space-y-3">
                    {aiReview.findings.map((finding) => (
                      <div
                        key={`${finding.severity}-${finding.title}`}
                        className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-semibold tracking-tight">{finding.title}</p>
                          <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                            {finding.severity}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                          {finding.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="eyebrow">Tippek</p>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground)]">
                    {aiReview.tips.map((tip) => (
                      <li key={tip} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="eyebrow">Következő lépés</p>
                  <p className="mt-4 text-sm leading-6 text-[var(--foreground)]">
                    {aiReview.nextStep}
                  </p>
                </article>
              </div>

              {aiReview.improvedExample ? (
                <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="eyebrow">Javított példa</p>
                  {aiReview.improvedExample.explanation ? (
                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                      {aiReview.improvedExample.explanation}
                    </p>
                  ) : null}
                  <pre className="mt-4 overflow-x-auto rounded-[1.3rem] bg-[#111827] p-4 text-sm leading-6 text-[#f8fafc]">
                    <code>{aiReview.improvedExample.code}</code>
                  </pre>
                </article>
              ) : null}
            </div>
          ) : null}

          <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
            <p className="eyebrow">Korábbi AI review-k</p>
            {aiReviewHistory.length ? (
              <div className="mt-4 space-y-3">
                {aiReviewHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold tracking-tight">
                        {entry.reviewScore}/100 AI · {entry.judgeScore}% judge
                      </p>
                      <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        {formatLocalTimestamp(entry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {entry.summary}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Ennél a feladatnál még nem készült helyben eltárolt AI review.
              </p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}