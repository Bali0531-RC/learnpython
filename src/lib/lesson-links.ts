import { practiceTasks } from "@/lib/practice-tasks";
import {
  archiveEntries,
  lessonPhases,
  lessonTaskLinksByLessonId,
  type Lesson,
  type LessonTaskLink,
} from "@/lib/site-data";

export type ResolvedLessonTaskLink = {
  kind: "practice" | "archive";
  targetId: string;
  href: string;
  title: string;
  badge: string;
  meta: string;
  reason: string;
};

export type LessonCatalogEntry = Lesson & {
  phaseSlug: string;
  phaseTitle: string;
  phaseAudience: string;
  path: string;
};

export type LessonWorkspaceActivityRecord = {
  targetId: string;
  timestamp: string;
  kind: "draft" | "run" | "submit";
  score?: number;
};

export type LessonMasteryStatus =
  | "uj"
  | "erintett"
  | "gyakorolt"
  | "ujraerositendo"
  | "stabil";

export type LessonWorkspaceActivitySummary = {
  lesson: LessonCatalogEntry;
  links: ResolvedLessonTaskLink[];
  totalLinks: number;
  touchedLinks: ResolvedLessonTaskLink[];
  stableLinks: ResolvedLessonTaskLink[];
  latestActivityAt: string | null;
  draftCount: number;
  runCount: number;
  submitCount: number;
  bestSubmitScore: number | null;
  mastery: LessonMasteryStatus;
};

export type LessonRecommendation = {
  lesson: LessonCatalogEntry;
  mastery: LessonMasteryStatus;
  reason: string;
  primaryLink: ResolvedLessonTaskLink | null;
};

const practiceTaskById = new Map(practiceTasks.map((task) => [task.id, task]));
const archiveEntryById = new Map(archiveEntries.map((entry) => [entry.id, entry]));
const lessonCatalog: LessonCatalogEntry[] = lessonPhases.flatMap((phase) =>
  phase.lessons.map((lesson) => ({
    ...lesson,
    phaseSlug: phase.slug,
    phaseTitle: phase.title,
    phaseAudience: phase.audience,
    path: `/tanulas#${lesson.id}`,
  })),
);
const lessonCatalogById = new Map(lessonCatalog.map((lesson) => [lesson.id, lesson]));

export function resolveLessonTaskLink(
  link: LessonTaskLink,
): ResolvedLessonTaskLink | null {
  if (link.kind === "practice") {
    const task = practiceTaskById.get(link.targetId);

    if (!task) {
      return null;
    }

    return {
      kind: "practice",
      targetId: task.id,
      href: `/gyakorlas/${task.id}`,
      title: task.title,
      badge: "Gyakorló drill",
      meta: `${task.level} · ${task.family}`,
      reason: link.reason,
    };
  }

  const entry = archiveEntryById.get(link.targetId);

  if (!entry) {
    return null;
  }

  return {
    kind: "archive",
    targetId: entry.id,
    href: `/vizsgaarchivum/${entry.id}`,
    title: entry.title,
    badge: entry.workspaceTaskId ? "Hivatalos on-site" : "Archív referencia",
    meta: `${entry.level} · ${entry.year} ${entry.season}`,
    reason: link.reason,
  };
}

export function getResolvedLessonTaskLinks(lessonId: string): ResolvedLessonTaskLink[] {
  return (lessonTaskLinksByLessonId[lessonId] ?? [])
    .map(resolveLessonTaskLink)
    .filter((item): item is ResolvedLessonTaskLink => Boolean(item));
}

export function getLessonCatalogEntry(lessonId: string): LessonCatalogEntry | null {
  return lessonCatalogById.get(lessonId) ?? null;
}

function resolveLessonMasteryStatus(input: {
  totalLinks: number;
  touchedLinkCount: number;
  stableLinkCount: number;
  draftCount: number;
  runCount: number;
  submitCount: number;
  bestSubmitScore: number | null;
}): LessonMasteryStatus {
  if (input.touchedLinkCount === 0) {
    return "uj";
  }

  if (input.stableLinkCount === input.totalLinks && input.totalLinks > 0) {
    return "stabil";
  }

  if (input.submitCount > 0) {
    if ((input.bestSubmitScore ?? 0) < 50) {
      return "ujraerositendo";
    }

    return "gyakorolt";
  }

  if (input.runCount > 0) {
    return "gyakorolt";
  }

  if (input.draftCount > 0) {
    return "erintett";
  }

  return "uj";
}

export function getLessonProgressSummaries(
  activityRecords: LessonWorkspaceActivityRecord[],
): LessonWorkspaceActivitySummary[] {
  const recordsByTargetId = new Map<string, LessonWorkspaceActivityRecord[]>();

  for (const record of activityRecords) {
    const existing = recordsByTargetId.get(record.targetId) ?? [];
    existing.push(record);
    recordsByTargetId.set(record.targetId, existing);
  }

  return lessonCatalog.map((lesson) => {
    const links = getResolvedLessonTaskLinks(lesson.id);
    const touchedLinks = links.filter((link) => recordsByTargetId.has(link.targetId));
    const stableLinks = touchedLinks.filter((link) => {
      const linkRecords = recordsByTargetId.get(link.targetId) ?? [];
      const bestSubmitScore = linkRecords
        .filter((record) => record.kind === "submit" && typeof record.score === "number")
        .map((record) => record.score ?? 0)
        .sort((left, right) => right - left)[0] ?? null;

      return bestSubmitScore !== null && bestSubmitScore >= 80;
    });
    const lessonRecords = touchedLinks.flatMap(
      (link) => recordsByTargetId.get(link.targetId) ?? [],
    );
    const latestActivityAt = lessonRecords
      .map((record) => record.timestamp)
      .sort()
      .reverse()[0] ?? null;
    const draftCount = lessonRecords.filter((record) => record.kind === "draft").length;
    const runCount = lessonRecords.filter((record) => record.kind === "run").length;
    const submitRecords = lessonRecords.filter((record) => record.kind === "submit");
    const submitCount = submitRecords.length;
    const bestSubmitScore = submitRecords
      .map((record) => record.score)
      .filter((score): score is number => typeof score === "number")
      .sort((left, right) => right - left)[0] ?? null;

    return {
      lesson,
      links,
      totalLinks: links.length,
      touchedLinks,
      stableLinks,
      latestActivityAt,
      draftCount,
      runCount,
      submitCount,
      bestSubmitScore,
      mastery: resolveLessonMasteryStatus({
        totalLinks: links.length,
        touchedLinkCount: touchedLinks.length,
        stableLinkCount: stableLinks.length,
        draftCount,
        runCount,
        submitCount,
        bestSubmitScore,
      }),
    } satisfies LessonWorkspaceActivitySummary;
  });
}

export function summarizeLessonWorkspaceActivity(
  activityRecords: LessonWorkspaceActivityRecord[],
): LessonWorkspaceActivitySummary[] {
  return getLessonProgressSummaries(activityRecords)
    .filter((item) => item.mastery !== "uj")
    .sort((left, right) =>
      (right.latestActivityAt ?? "").localeCompare(left.latestActivityAt ?? ""),
    );
}

export function getNextLessonRecommendation(
  activityRecords: LessonWorkspaceActivityRecord[],
): LessonRecommendation | null {
  const summaries = getLessonProgressSummaries(activityRecords);
  const nextLesson = summaries.find((summary) => summary.mastery !== "stabil");

  if (!nextLesson) {
    return null;
  }

  const unresolvedLink = nextLesson.links.find(
    (link) => !nextLesson.stableLinks.some((stableLink) => stableLink.targetId === link.targetId),
  ) ?? nextLesson.links[0] ?? null;

  const reasonByMastery: Record<LessonMasteryStatus, string> = {
    uj: "Ez a következő még nem érintett lecke a jelenlegi tanulási ívben.",
    erintett: "Ehhez a leckéhez már van helyi draft vagy megnyitott workspace, de még nincs futtatási rutin.",
    gyakorolt:
      "Ehhez a leckéhez már tartozik futás vagy részleges pontozott próbálkozás, de még nincs teljesen stabil lefedés.",
    ujraerositendo:
      "Ehhez a leckéhez már volt pontozott próbálkozás, de a helyi eredmények alapján még érdemes újraerősíteni.",
    stabil: "Ez a lecke helyi adatok alapján stabilnak látszik.",
  };

  return {
    lesson: nextLesson.lesson,
    mastery: nextLesson.mastery,
    reason: reasonByMastery[nextLesson.mastery],
    primaryLink: unresolvedLink,
  };
}