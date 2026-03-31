import "server-only";

import type { Prisma } from "@prisma/client";

import { getArchiveTaskById } from "./archive-tasks";
import { db } from "./db";
import {
  getResolvedLessonTaskLinks,
  type ResolvedLessonTaskLink,
} from "./lesson-links";
import { getPracticeTaskById, practiceTasks } from "./practice-tasks";
import {
  archiveEntries,
  getArchiveEntryById,
  lessonPhases,
  type ArchiveAsset,
  type ArchiveEntry,
  type Lesson,
  type LessonPhase,
} from "./site-data";
import type {
  TaskFile,
  TaskStatementBlock,
  TaskTestCase,
  WorkspaceRule,
  WorkspaceTask,
} from "./task-types";

export type LessonWithResourceLinks = Lesson & {
  resourceLinks: ResolvedLessonTaskLink[];
};

export type LessonPhaseWithResourceLinks = Omit<LessonPhase, "lessons"> & {
  lessons: LessonWithResourceLinks[];
};

type TaskRecord = Prisma.TaskGetPayload<{
  include: {
    tests: true;
    files: true;
  };
}>;

type LessonRecord = Prisma.LessonGetPayload<{
  include: {
    resourceLinks: true;
  };
}>;

const practiceOrder = new Map(practiceTasks.map((task, index) => [task.id, index]));
const archiveOrder = new Map(archiveEntries.map((entry, index) => [entry.id, index]));

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

async function withDatabaseFallback<T>(query: () => Promise<T>): Promise<T | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    return await query();
  } catch {
    return null;
  }
}

function byStaticOrder<T extends { id: string }>(
  items: T[],
  orderMap: Map<string, number>,
) {
  return [...items].sort(
    (left, right) =>
      (orderMap.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
      (orderMap.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

function asJson<T>(value: Prisma.JsonValue | null | undefined, fallback: T): T {
  return (value ?? fallback) as T;
}

function mapDbTask(task: TaskRecord): WorkspaceTask {
  const publicTests = task.tests
    .filter((test) => test.suite === "public")
    .sort((left, right) => left.position - right.position)
    .map<TaskTestCase>((test) => ({
      label: test.label,
      input: test.input,
      expectedOutput: test.expectedOutput,
      explanation: test.explanation,
    }));

  const hiddenTests = task.tests
    .filter((test) => test.suite === "hidden")
    .sort((left, right) => left.position - right.position)
    .map<TaskTestCase>((test) => ({
      label: test.label,
      input: test.input,
      expectedOutput: test.expectedOutput,
      explanation: test.explanation,
    }));

  const providedFiles = task.files
    .sort((left, right) => left.position - right.position)
    .map<TaskFile>((file) => ({
      path: file.path,
      description: file.description,
      content: file.content,
    }));

  return {
    id: task.id,
    title: task.title,
    track: task.track,
    level: task.level as "Közép" | "Emelt",
    family: task.family,
    inputMode: task.inputMode === "provided_files" ? "provided-files" : "stdin",
    estimatedMinutes: task.estimatedMinutes,
    summary: task.summary,
    skillFocus: asJson(task.skillFocus, [] as string[]),
    editorTips: asJson(task.editorTips, [] as string[]),
    source: {
      kind:
        task.sourceKind === "official_archive"
          ? "official-archive"
          : "platform-authored",
      label: task.sourceLabel,
      note: task.sourceNote,
    },
    statement: asJson(task.statement, [] as TaskStatementBlock[]),
    inputFormat: asJson(task.inputFormat, [] as string[]),
    outputFormat: asJson(task.outputFormat, [] as string[]),
    workspaceRules: asJson(task.workspaceRules, [] as WorkspaceRule[]),
    publicTests,
    hiddenTests: hiddenTests.length ? hiddenTests : undefined,
    providedFiles: providedFiles.length ? providedFiles : undefined,
    starterCode: task.starterCode,
  };
}

function mapDbArchiveEntry(entry: Prisma.ArchiveEntryGetPayload<object>): ArchiveEntry {
  return {
    id: entry.id,
    year: entry.year,
    season: entry.season,
    level: entry.level as "Közép" | "Emelt",
    title: entry.title,
    family: entry.family,
    note: entry.note,
    source: entry.source,
    workspaceTaskId: entry.workspaceTaskId ?? undefined,
    fileHighlights: asJson(entry.fileHighlights, undefined as string[] | undefined),
    assets: asJson(entry.assets, undefined as ArchiveAsset[] | undefined),
  };
}

function buildStaticLearningPhases(): LessonPhaseWithResourceLinks[] {
  return lessonPhases.map((phase) => ({
    ...phase,
    lessons: phase.lessons.map((lesson) => ({
      ...lesson,
      resourceLinks: getResolvedLessonTaskLinks(lesson.id),
    })),
  }));
}

function buildLearningPhasesFromDb(lessons: LessonRecord[]): LessonPhaseWithResourceLinks[] {
  const grouped = new Map<string, LessonPhaseWithResourceLinks>();

  for (const lesson of lessons) {
    const existing = grouped.get(lesson.phaseSlug);
    const nextLesson: LessonWithResourceLinks = {
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      examValue: lesson.examValue,
      resourceLinks: lesson.resourceLinks
        .sort((left, right) => left.position - right.position)
        .map((link) => ({
          kind: link.kind,
          targetId: link.targetId,
          href: link.href,
          title: link.title,
          badge: link.badge,
          meta: link.meta,
          reason: link.reason,
        })),
    };

    if (!existing) {
      grouped.set(lesson.phaseSlug, {
        slug: lesson.phaseSlug,
        title: lesson.phaseTitle,
        audience: lesson.phaseAudience,
        description: lesson.phaseDescription,
        lessons: [nextLesson],
      });
      continue;
    }

    existing.lessons.push(nextLesson);
  }

  const phaseOrder = new Map(lessonPhases.map((phase, index) => [phase.slug, index]));

  return [...grouped.values()].sort(
    (left, right) =>
      (phaseOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER) -
      (phaseOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER),
  );
}

export async function listLearningPhases(): Promise<LessonPhaseWithResourceLinks[]> {
  const lessons = await withDatabaseFallback(() =>
    db.lesson.findMany({
      include: {
        resourceLinks: true,
      },
      orderBy: [{ phaseOrder: "asc" }, { orderInPhase: "asc" }],
    }),
  );

  if (!lessons?.length) {
    return buildStaticLearningPhases();
  }

  return buildLearningPhasesFromDb(lessons);
}

export async function listPracticeTasksContent(): Promise<WorkspaceTask[]> {
  const tasks = await withDatabaseFallback(() =>
    db.task.findMany({
      where: {
        sourceKind: "platform_authored",
      },
      include: {
        tests: true,
        files: true,
      },
    }),
  );

  if (!tasks?.length) {
    return practiceTasks;
  }

  return byStaticOrder(tasks.map(mapDbTask), practiceOrder);
}

export async function getPracticeTaskContent(
  taskId: string,
): Promise<WorkspaceTask | undefined> {
  const task = await withDatabaseFallback(() =>
    db.task.findFirst({
      where: {
        id: taskId,
        sourceKind: "platform_authored",
      },
      include: {
        tests: true,
        files: true,
      },
    }),
  );

  return task ? mapDbTask(task) : getPracticeTaskById(taskId);
}

export async function getWorkspaceTaskContent(
  taskId: string,
): Promise<WorkspaceTask | undefined> {
  const task = await withDatabaseFallback(() =>
    db.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        tests: true,
        files: true,
      },
    }),
  );

  if (task) {
    return mapDbTask(task);
  }

  return getPracticeTaskById(taskId) ?? getArchiveTaskById(taskId);
}

export async function listArchiveEntriesContent(): Promise<ArchiveEntry[]> {
  const entries = await withDatabaseFallback(() => db.archiveEntry.findMany());

  if (!entries?.length) {
    return archiveEntries;
  }

  return byStaticOrder(entries.map(mapDbArchiveEntry), archiveOrder);
}

export async function getArchiveEntryContent(
  entryId: string,
): Promise<ArchiveEntry | undefined> {
  const entry = await withDatabaseFallback(() =>
    db.archiveEntry.findUnique({
      where: {
        id: entryId,
      },
    }),
  );

  return entry ? mapDbArchiveEntry(entry) : getArchiveEntryById(entryId);
}

export async function getArchiveWorkspaceTaskContent(
  taskId: string,
): Promise<WorkspaceTask | undefined> {
  const task = await withDatabaseFallback(() =>
    db.task.findFirst({
      where: {
        id: taskId,
        sourceKind: "official_archive",
      },
      include: {
        tests: true,
        files: true,
      },
    }),
  );

  return task ? mapDbTask(task) : getArchiveTaskById(taskId);
}