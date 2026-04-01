export const AI_REVIEW_LIMIT = 20;

export type AiReviewSeverity = "low" | "medium" | "high";

export type AiReviewFinding = {
  title: string;
  severity: AiReviewSeverity;
  detail: string;
};

export type AiReviewImprovedExample = {
  code: string;
  explanation?: string;
};

export type AiReviewResultRowInput = {
  label: string;
  passed: boolean;
  expectedOutput?: string;
  actualOutput?: string;
  stderr: string;
  timedOut: boolean;
  resourceExceeded?: boolean;
  resourceMessage?: string | null;
};

export type AiReviewVerdictInput = {
  mode: "run" | "submit";
  suite: "public" | "hidden";
  outputVisibility: "full" | "masked";
  score: number;
  passed: number;
  total: number;
  blocked: boolean;
  blockReason?: string | null;
  resourceExceeded?: boolean;
  resourceMessage?: string | null;
  terminatedEarly?: boolean;
  results: AiReviewResultRowInput[];
};

export type AiReviewQuota = {
  limit: number;
  used: number;
  remaining: number;
};

export type AiReviewGlobalTokenQuota = {
  limit: number;
  used: number;
  remaining: number;
  windowSeconds: number;
  resetAt: string | null;
};

export type AiReviewResult = {
  score: number;
  summary: string;
  strengths: string[];
  findings: AiReviewFinding[];
  tips: string[];
  nextStep: string;
  improvedExample?: AiReviewImprovedExample;
  createdAt: string;
  model: string;
  requestId: string | null;
  basedOn: {
    judgeScore: number;
    passed: number;
    total: number;
    mode: "run" | "submit";
    suite: "public" | "hidden";
  };
};

export type AiReviewRequestPayload = {
  taskId: string;
  code: string;
  verdict: AiReviewVerdictInput;
};

export type AiReviewRouteResponse = {
  ok: boolean;
  available: boolean;
  quota: AiReviewQuota;
  globalTokenQuota?: AiReviewGlobalTokenQuota;
  model?: string;
  review?: AiReviewResult;
  error?: string;
};