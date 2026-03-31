import type { TaskSource, TaskTrack } from "@/lib/task-types";

const DRAFTS_KEY = "kodrettsegi:workspace-drafts:v1";
const HISTORY_KEY = "kodrettsegi:workspace-history:v1";
const HISTORY_LIMIT = 40;
const STORAGE_EVENT = "kodrettsegi:workspace-storage";

const EMPTY_DRAFTS: StoredDraftRecord[] = [];
const EMPTY_HISTORY: StoredVerdictRecord[] = [];

let cachedDraftsRaw = "";
let cachedDraftsSnapshot: StoredDraftRecord[] = EMPTY_DRAFTS;
let cachedHistoryRaw = "";
let cachedHistorySnapshot: StoredVerdictRecord[] = EMPTY_HISTORY;

export type StoredDraftRecord = {
  taskId: string;
  taskPath: string;
  taskTitle: string;
  track: TaskTrack;
  level: "Közép" | "Emelt";
  family: string;
  sourceKind: TaskSource["kind"];
  code: string;
  updatedAt: string;
};

export type StoredVerdictRecord = {
  id: string;
  taskId: string;
  taskPath: string;
  taskTitle: string;
  track: TaskTrack;
  level: "Közép" | "Emelt";
  family: string;
  sourceKind: TaskSource["kind"];
  mode: "run" | "submit";
  suite: "public" | "hidden";
  outputVisibility: "full" | "masked";
  score: number;
  passed: number;
  total: number;
  blocked: boolean;
  createdAt: string;
};

type DraftMap = Record<string, StoredDraftRecord>;

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function notifyStorageChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function subscribeWorkspaceStorage(listener: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleChange = () => listener();

  window.addEventListener("storage", handleChange);
  window.addEventListener(STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(STORAGE_EVENT, handleChange);
  };
}

export function formatLocalTimestamp(isoTimestamp: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoTimestamp));
}

export function loadTaskDraft(taskId: string): StoredDraftRecord | null {
  const drafts = readJson<DraftMap>(DRAFTS_KEY, {});
  return drafts[taskId] ?? null;
}

export function listTaskDrafts(): StoredDraftRecord[] {
  const drafts = readJson<DraftMap>(DRAFTS_KEY, {});
  return Object.values(drafts).sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function getTaskDraftsSnapshot(): StoredDraftRecord[] {
  if (!isBrowser()) {
    return EMPTY_DRAFTS;
  }

  const raw = window.localStorage.getItem(DRAFTS_KEY) ?? "";

  if (raw === cachedDraftsRaw) {
    return cachedDraftsSnapshot;
  }

  cachedDraftsRaw = raw;
  cachedDraftsSnapshot = listTaskDrafts();
  return cachedDraftsSnapshot;
}

export function saveTaskDraft(draft: StoredDraftRecord) {
  const drafts = readJson<DraftMap>(DRAFTS_KEY, {});
  drafts[draft.taskId] = draft;
  writeJson(DRAFTS_KEY, drafts);
  notifyStorageChange();
  return draft;
}

export function clearTaskDraft(taskId: string) {
  const drafts = readJson<DraftMap>(DRAFTS_KEY, {});

  if (!(taskId in drafts)) {
    return;
  }

  delete drafts[taskId];
  writeJson(DRAFTS_KEY, drafts);
  notifyStorageChange();
}

export function listWorkspaceHistory(): StoredVerdictRecord[] {
  return readJson<StoredVerdictRecord[]>(HISTORY_KEY, []).sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export function getWorkspaceHistorySnapshot(): StoredVerdictRecord[] {
  if (!isBrowser()) {
    return EMPTY_HISTORY;
  }

  const raw = window.localStorage.getItem(HISTORY_KEY) ?? "";

  if (raw === cachedHistoryRaw) {
    return cachedHistorySnapshot;
  }

  cachedHistoryRaw = raw;
  cachedHistorySnapshot = listWorkspaceHistory();
  return cachedHistorySnapshot;
}

export function listTaskHistory(taskId: string): StoredVerdictRecord[] {
  return listWorkspaceHistory().filter((entry) => entry.taskId === taskId);
}

export function appendWorkspaceHistory(entry: StoredVerdictRecord) {
  const history = [entry, ...listWorkspaceHistory()].slice(0, HISTORY_LIMIT);
  writeJson(HISTORY_KEY, history);
  notifyStorageChange();
  return history;
}