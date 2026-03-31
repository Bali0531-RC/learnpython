export type TaskTrack = "kozep" | "emelt";

export type TaskSource = {
  kind: "platform-authored" | "official-archive";
  label: string;
  note: string;
};

export type TaskInputMode = "stdin" | "provided-files";

export type TaskFile = {
  path: string;
  description: string;
  content: string;
};

export type TaskStatementBlock = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type WorkspaceRule = {
  title: string;
  description: string;
};

export type TaskTestCase = {
  label: string;
  input: string;
  expectedOutput: string;
  explanation: string;
};

export type WorkspaceTask = {
  id: string;
  title: string;
  track: TaskTrack;
  level: "Közép" | "Emelt";
  family: string;
  inputMode: TaskInputMode;
  estimatedMinutes: string;
  summary: string;
  skillFocus: string[];
  editorTips: string[];
  source: TaskSource;
  statement: TaskStatementBlock[];
  inputFormat: string[];
  outputFormat: string[];
  workspaceRules: WorkspaceRule[];
  publicTests: TaskTestCase[];
  hiddenTests?: TaskTestCase[];
  providedFiles?: TaskFile[];
  starterCode: string;
};