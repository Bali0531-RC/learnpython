"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import {
  getLessonProgressSummaries,
  getNextLessonRecommendation,
  summarizeLessonWorkspaceActivity,
  type LessonMasteryStatus,
} from "@/lib/lesson-links";
import {
  formatLocalTimestamp,
  getTaskDraftsSnapshot,
  getWorkspaceHistorySnapshot,
  subscribeWorkspaceStorage,
  type StoredDraftRecord,
  type StoredVerdictRecord,
} from "@/lib/workspace-storage";

const EMPTY_DRAFTS: StoredDraftRecord[] = [];
const EMPTY_HISTORY: StoredVerdictRecord[] = [];

const lessonMasteryCopy: Record<
  LessonMasteryStatus,
  { label: string; tone: string }
> = {
  uj: {
    label: "Új",
    tone: "border-[var(--line)] text-[var(--muted)]",
  },
  erintett: {
    label: "Érintett",
    tone: "border-[var(--line)] text-[var(--foreground)]",
  },
  gyakorolt: {
    label: "Gyakorolt",
    tone: "border-[var(--accent)] text-[var(--accent-alt)]",
  },
  ujraerositendo: {
    label: "Újraerősítendő",
    tone: "border-[#d97706] text-[#d97706]",
  },
  stabil: {
    label: "Stabil",
    tone: "border-[#15803d] text-[#15803d]",
  },
};

export function ProgressSnapshot() {
  const drafts = useSyncExternalStore<StoredDraftRecord[]>(
    subscribeWorkspaceStorage,
    getTaskDraftsSnapshot,
    () => EMPTY_DRAFTS,
  );
  const history = useSyncExternalStore<StoredVerdictRecord[]>(
    subscribeWorkspaceStorage,
    getWorkspaceHistorySnapshot,
    () => EMPTY_HISTORY,
  );

  const activityRecords = useMemo(
    () => [
      ...drafts.map((draft) => ({
        targetId: draft.taskId,
        timestamp: draft.updatedAt,
        kind: "draft" as const,
      })),
      ...history.map((entry) => ({
        targetId: entry.taskId,
        timestamp: entry.createdAt,
        kind: entry.mode,
        score: entry.score,
      })),
    ],
    [drafts, history],
  );
  const submitCount = useMemo(
    () => history.filter((entry) => entry.mode === "submit").length,
    [history],
  );
  const touchedWorkspaceCount = useMemo(
    () => new Set([...drafts.map((draft) => draft.taskId), ...history.map((entry) => entry.taskId)]).size,
    [drafts, history],
  );
  const latestActivity = useMemo(() => {
    const timestamps = [history[0]?.createdAt, drafts[0]?.updatedAt].filter(Boolean);
    return timestamps.sort().reverse()[0] ?? null;
  }, [drafts, history]);
  const lessonProgress = useMemo(
    () => getLessonProgressSummaries(activityRecords),
    [activityRecords],
  );
  const lessonActivity = useMemo(
    () => summarizeLessonWorkspaceActivity(activityRecords),
    [activityRecords],
  );
  const stableLessonCount = useMemo(
    () => lessonProgress.filter((entry) => entry.mastery === "stabil").length,
    [lessonProgress],
  );
  const reviewLessonCount = useMemo(
    () => lessonProgress.filter((entry) => entry.mastery === "ujraerositendo").length,
    [lessonProgress],
  );
  const nextRecommendation = useMemo(
    () => getNextLessonRecommendation(activityRecords),
    [activityRecords],
  );

  return (
    <section className="section-card p-8 sm:p-10">
      <p className="eyebrow">Helyi progress snapshot</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        A mostani böngészőben már megmarad a kódvázlat és a friss próbák nyoma.
      </h2>
      <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
        Ez még nem felhasználói fiókos, szerveroldali history, hanem egy átmeneti perzisztencia-szelet.
        A workspace helyben menti a piszkozatot, és a sikeresen visszaérkező futásokat vagy beküldéseket is eltárolja a későbbi progress-modell előkészítéséhez.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <article className="surface-soft rounded-3xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Mentett piszkozatok
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{drafts.length}</p>
        </article>
        <article className="surface-soft rounded-3xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Rögzített próbák
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{history.length}</p>
        </article>
        <article className="surface-soft rounded-3xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Pontozott beküldések
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{submitCount}</p>
        </article>
        <article className="surface-soft rounded-3xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Érintett leckék
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{lessonActivity.length}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {touchedWorkspaceCount} aktív workspace alapján visszavetítve.
          </p>
        </article>
        <article className="surface-soft rounded-3xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Stabil leckék
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{stableLessonCount}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {reviewLessonCount
              ? `${reviewLessonCount} lecke még újraerősítendő helyi eredmények alapján.`
              : "Jelenleg nincs olyan lecke, amit a helyi adatok külön újraerősítendőnek jeleznének."}
          </p>
        </article>
        <article className="surface-soft rounded-3xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Utolsó aktivitás
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[var(--foreground)]">
            {latestActivity ? formatLocalTimestamp(latestActivity) : "Még nincs helyi aktivitás"}
          </p>
        </article>
      </div>

      <article className="surface-soft mt-6 rounded-[1.8rem] border border-[var(--line)] p-6">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Következő ajánlott lecke</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              A helyi adatok alapján kijelölhető a következő logikus állomás.
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            Ez még nem szerveroldali skill-modell, csak egy helyi mastery-becslés a draftokból és a futási előzményekből.
          </p>
        </div>

        {nextRecommendation ? (
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] ${lessonMasteryCopy[nextRecommendation.mastery].tone}`}
                >
                  {lessonMasteryCopy[nextRecommendation.mastery].label}
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  {nextRecommendation.lesson.phaseTitle}
                </span>
              </div>
              <Link
                className="mt-4 block text-2xl font-semibold tracking-tight underline underline-offset-4"
                href={nextRecommendation.lesson.path}
              >
                {nextRecommendation.lesson.title}
              </Link>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {nextRecommendation.lesson.summary}
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--foreground)]">
                {nextRecommendation.reason}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5">
              <p className="eyebrow">Ajánlott belépési pont</p>
              {nextRecommendation.primaryLink ? (
                <>
                  <Link
                    className="mt-4 block rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-soft)] p-4 transition-colors hover:bg-[var(--surface)]"
                    href={nextRecommendation.primaryLink.href}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        {nextRecommendation.primaryLink.badge}
                      </span>
                      <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                        {nextRecommendation.primaryLink.meta}
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-semibold tracking-tight">
                      {nextRecommendation.primaryLink.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {nextRecommendation.primaryLink.reason}
                    </p>
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold tracking-tight transition-colors hover:bg-[var(--surface-soft)]"
                      href={nextRecommendation.primaryLink.href}
                    >
                      Workspace megnyitása
                    </Link>
                    <Link
                      className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold tracking-tight transition-colors hover:bg-[var(--surface-soft)]"
                      href={nextRecommendation.lesson.path}
                    >
                      Lecke megnyitása
                    </Link>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  Ehhez a leckéhez még nincs külön workspace ajánlás, de a lecketérképen már elérhető a kontextus.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-5 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            A jelenlegi helyi adatok alapján minden kapcsolt lecke stabilnak tűnik. A következő lépés lehet új
            archive vagy gyakorló workspace felvétele a tanulási ívbe.
          </p>
        )}
      </article>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-6">
          <p className="eyebrow">Legutóbbi próbák</p>
          {history.length ? (
            <div className="mt-4 space-y-3">
              {history.slice(0, 6).map((entry) => (
                <div key={entry.id} className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link className="font-semibold tracking-tight underline underline-offset-4" href={entry.taskPath}>
                      {entry.taskTitle}
                    </Link>
                    <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {formatLocalTimestamp(entry.createdAt)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm leading-6 text-[var(--muted)]">
                    <span>{entry.mode === "run" ? "Futtatás" : "Pontozott beküldés"}</span>
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
              Még nincs olyan futás vagy beküldés, amely sikeresen visszaért a judge-tól és bekerült a helyi timeline-ba.
            </p>
          )}
        </article>

        <article className="surface-soft rounded-[1.8rem] border border-[var(--line)] p-6">
          <p className="eyebrow">Aktív piszkozatok</p>
          {drafts.length ? (
            <div className="mt-4 space-y-3">
              {drafts.slice(0, 6).map((draft) => (
                <div key={draft.taskId} className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link className="font-semibold tracking-tight underline underline-offset-4" href={draft.taskPath}>
                      {draft.taskTitle}
                    </Link>
                    <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {formatLocalTimestamp(draft.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm leading-6 text-[var(--muted)]">
                    <span>{draft.level}</span>
                    <span>{draft.track === "kozep" ? "Közép fókusz" : "Emelt fókusz"}</span>
                    <span>{draft.family}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Még nincs helyben mentett piszkozat. Ha módosítasz egy kódszerkesztőt, az ide automatikusan felkerül.
            </p>
          )}
        </article>
      </div>

      <article className="surface-soft mt-6 rounded-[1.8rem] border border-[var(--line)] p-6">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Lecketérkép visszavetítés</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              A helyi workspace-aktivitásból már látszik, mely leckékhez jutottál el.
            </h3>
          </div>
          <Link
            className="w-fit rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold tracking-tight transition-colors hover:bg-[var(--surface)]"
            href="/tanulas"
          >
            Lecketérkép megnyitása
          </Link>
        </div>

        {lessonActivity.length ? (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {lessonActivity.slice(0, 6).map((entry) => (
              <div
                key={entry.lesson.id}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        className="text-lg font-semibold tracking-tight underline underline-offset-4"
                        href={entry.lesson.path}
                      >
                        {entry.lesson.title}
                      </Link>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] ${lessonMasteryCopy[entry.mastery].tone}`}
                      >
                        {lessonMasteryCopy[entry.mastery].label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {entry.lesson.phaseTitle} · {entry.lesson.phaseAudience}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    {entry.latestActivityAt
                      ? formatLocalTimestamp(entry.latestActivityAt)
                      : "Nincs aktivitás"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {entry.lesson.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm leading-6 text-[var(--muted)]">
                  <span>{entry.touchedLinks.length}/{entry.totalLinks} kapcsolt workspace aktív</span>
                  {entry.stableLinks.length ? <span>{entry.stableLinks.length} stabil link</span> : null}
                  {entry.draftCount ? <span>{entry.draftCount} draft</span> : null}
                  {entry.runCount ? <span>{entry.runCount} futás</span> : null}
                  {entry.submitCount ? <span>{entry.submitCount} beküldés</span> : null}
                  {entry.bestSubmitScore !== null ? <span>legjobb submit {entry.bestSubmitScore}%</span> : null}
                </div>

                <div className="mt-4 grid gap-3">
                  {entry.touchedLinks.map((link) => (
                    <Link
                      key={`${entry.lesson.id}-${link.href}`}
                      className="rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-soft)] p-4 transition-colors hover:bg-[var(--surface)]"
                      href={link.href}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                          {link.badge}
                        </span>
                        <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                          {link.meta}
                        </span>
                      </div>
                      <p className="mt-3 font-semibold tracking-tight">{link.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {link.reason}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Még nincs olyan helyi aktivitás, amit vissza tudnánk vetíteni a lecketérképre. Nyiss meg
            egy gyakorló vagy archív workspace-et a
            <Link className="ml-1 underline underline-offset-4" href="/tanulas">
              tanulási útvonalról
            </Link>
            , és a kapcsolódó leckék itt automatikusan megjelennek.
          </p>
        )}
      </article>
    </section>
  );
}