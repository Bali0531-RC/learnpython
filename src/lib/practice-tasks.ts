import type { WorkspaceTask } from "@/lib/task-types";

import { emeltPracticeTasks } from "@/lib/practice-tasks-emelt";
import { kozepPracticeTasks } from "@/lib/practice-tasks-kozep";

export type {
  TaskFile as PracticeTaskFile,
  TaskInputMode as PracticeTaskInputMode,
  TaskSource,
  TaskStatementBlock,
  TaskTestCase as PracticeTaskTestCase,
  TaskTrack as PracticeTrack,
  WorkspaceRule,
  WorkspaceTask as PracticeTask,
} from "@/lib/task-types";

export const practiceTasks: WorkspaceTask[] = [
  ...kozepPracticeTasks,
  ...emeltPracticeTasks,
];

export function getPracticeTaskById(taskId: string): WorkspaceTask | undefined {
  return practiceTasks.find((task) => task.id === taskId);
}