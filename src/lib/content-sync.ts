import {
  Prisma,
  PrismaClient,
  type LearningTrack,
  type ResourceLinkKind,
  type TaskInputMode,
  type TaskSourceKind,
  type TestSuite,
} from "@prisma/client";

import { archiveTasks } from "./archive-tasks";
import { getResolvedLessonTaskLinks } from "./lesson-links";
import { practiceTasks } from "./practice-tasks";
import { archiveEntries, lessonPhases } from "./site-data";

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function toNullableJson(
  value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  return value == null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

function toSourceKind(
  kind: "platform-authored" | "official-archive",
): TaskSourceKind {
  return kind === "platform-authored" ? "platform_authored" : "official_archive";
}

function toInputMode(
  mode: "stdin" | "provided-files",
): TaskInputMode {
  return mode === "stdin" ? "stdin" : "provided_files";
}

function toTrack(track: "kozep" | "emelt"): LearningTrack {
  return track;
}

function toLinkKind(
  kind: "practice" | "archive",
): ResourceLinkKind {
  return kind;
}

function toSuite(suite: "public" | "hidden"): TestSuite {
  return suite;
}

function buildLessonRows() {
  return lessonPhases.flatMap((phase, phaseOrder) =>
    phase.lessons.map((lesson, orderInPhase) => ({
      id: lesson.id,
      phaseSlug: phase.slug,
      phaseTitle: phase.title,
      phaseAudience: phase.audience,
      phaseDescription: phase.description,
      phaseOrder,
      orderInPhase,
      title: lesson.title,
      summary: lesson.summary,
      examValue: lesson.examValue,
    })),
  );
}

function buildLessonResourceLinkRows() {
  return lessonPhases.flatMap((phase) =>
    phase.lessons.flatMap((lesson) =>
      getResolvedLessonTaskLinks(lesson.id).map((link, position) => ({
        lessonId: lesson.id,
        kind: toLinkKind(link.kind),
        targetId: link.targetId,
        href: link.href,
        title: link.title,
        badge: link.badge,
        meta: link.meta,
        reason: link.reason,
        position,
      })),
    ),
  );
}

function buildTaskRows() {
  return [...practiceTasks, ...archiveTasks].map((task) => ({
    id: task.id,
    title: task.title,
    track: toTrack(task.track),
    level: task.level,
    family: task.family,
    inputMode: toInputMode(task.inputMode),
    estimatedMinutes: task.estimatedMinutes,
    summary: task.summary,
    skillFocus: toJson(task.skillFocus),
    editorTips: toJson(task.editorTips),
    sourceKind: toSourceKind(task.source.kind),
    sourceLabel: task.source.label,
    sourceNote: task.source.note,
    statement: toJson(task.statement),
    inputFormat: toJson(task.inputFormat),
    outputFormat: toJson(task.outputFormat),
    workspaceRules: toJson(task.workspaceRules),
    starterCode: task.starterCode,
    routePath:
      task.source.kind === "official-archive"
        ? `/vizsgaarchivum/${task.id}`
        : `/gyakorlas/${task.id}`,
    tests: [
      ...task.publicTests.map((test, position) => ({
        suite: toSuite("public"),
        position,
        label: test.label,
        input: test.input,
        expectedOutput: test.expectedOutput,
        explanation: test.explanation,
      })),
      ...(task.hiddenTests ?? []).map((test, position) => ({
        suite: toSuite("hidden"),
        position,
        label: test.label,
        input: test.input,
        expectedOutput: test.expectedOutput,
        explanation: test.explanation,
      })),
    ],
    files: (task.providedFiles ?? []).map((file, position) => ({
      position,
      path: file.path,
      description: file.description,
      content: file.content,
    })),
  }));
}

function buildArchiveEntryRows() {
  return archiveEntries.map((entry) => ({
    id: entry.id,
    year: entry.year,
    season: entry.season,
    level: entry.level,
    title: entry.title,
    family: entry.family,
    note: entry.note,
    source: entry.source,
    fileHighlights: toNullableJson(entry.fileHighlights),
    assets: toNullableJson(entry.assets),
    workspaceTaskId: entry.workspaceTaskId ?? null,
  }));
}

export type StaticContentSyncSummary = {
  lessons: number;
  lessonResourceLinks: number;
  tasks: number;
  taskTests: number;
  taskFiles: number;
  archiveEntries: number;
};

export async function syncStaticContent(
  prisma: PrismaClient,
): Promise<StaticContentSyncSummary> {
  const lessonRows = buildLessonRows();
  const lessonResourceLinkRows = buildLessonResourceLinkRows();
  const taskRows = buildTaskRows();
  const archiveEntryRows = buildArchiveEntryRows();

  await prisma.$transaction(async (tx) => {
    for (const lesson of lessonRows) {
      await tx.lesson.upsert({
        where: { id: lesson.id },
        create: lesson,
        update: lesson,
      });
    }

    for (const lesson of lessonRows) {
      await tx.lessonResourceLink.deleteMany({ where: { lessonId: lesson.id } });

      const lessonLinks = lessonResourceLinkRows.filter(
        (link) => link.lessonId === lesson.id,
      );

      if (lessonLinks.length > 0) {
        await tx.lessonResourceLink.createMany({ data: lessonLinks });
      }
    }

    for (const task of taskRows) {
      const { tests, files, ...taskData } = task;

      await tx.task.upsert({
        where: { id: task.id },
        create: taskData,
        update: taskData,
      });

      await tx.taskTestCase.deleteMany({ where: { taskId: task.id } });
      if (tests.length > 0) {
        await tx.taskTestCase.createMany({
          data: tests.map((test) => ({
            taskId: task.id,
            suite: test.suite,
            position: test.position,
            label: test.label,
            input: test.input,
            expectedOutput: test.expectedOutput,
            explanation: test.explanation,
          })),
        });
      }

      await tx.taskProvidedFile.deleteMany({ where: { taskId: task.id } });
      if (files.length > 0) {
        await tx.taskProvidedFile.createMany({
          data: files.map((file) => ({
            taskId: task.id,
            position: file.position,
            path: file.path,
            description: file.description,
            content: file.content,
          })),
        });
      }
    }

    for (const entry of archiveEntryRows) {
      await tx.archiveEntry.upsert({
        where: { id: entry.id },
        create: entry,
        update: entry,
      });
    }
  });

  return {
    lessons: lessonRows.length,
    lessonResourceLinks: lessonResourceLinkRows.length,
    tasks: taskRows.length,
    taskTests: taskRows.reduce((sum, task) => sum + task.tests.length, 0),
    taskFiles: taskRows.reduce((sum, task) => sum + task.files.length, 0),
    archiveEntries: archiveEntryRows.length,
  };
}