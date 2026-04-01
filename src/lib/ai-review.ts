import "server-only";

import { createRequire } from "node:module";

import type {
  AiReviewFinding,
  AiReviewImprovedExample,
  AiReviewQuota,
  AiReviewResult,
  AiReviewSeverity,
  AiReviewVerdictInput,
} from "@/lib/ai-review-types";
import { AI_REVIEW_LIMIT } from "@/lib/ai-review-types";
import type { WorkspaceTask } from "@/lib/task-types";

const nodeRequire = createRequire(`${process.cwd()}/package.json`);

export const AI_REVIEW_COOKIE_NAME = "kodrettsegi-ai-review-count-v1";

const DEFAULT_REVIEW_MODEL = "gpt-5.4";
const MAX_CODE_CHARS = 12_000;
const MAX_TEXT_CHARS = 3_000;

type GeneratedAiReview = Omit<AiReviewResult, "createdAt" | "model" | "requestId" | "basedOn">;
type OpenAIMessage = {
  role: "developer" | "user";
  content: string;
};
type OpenAICompletion = {
  model: string;
  choices: Array<{
    message?: {
      content?: unknown;
    };
  }>;
  _request_id?: string | null;
};
type OpenAIClient = {
  chat: {
    completions: {
      create(options: {
        model: string;
        temperature: number;
        messages: OpenAIMessage[];
      }): Promise<OpenAICompletion>;
    };
  };
};
type OpenAIConstructor = new (options: {
  apiKey: string;
  maxRetries: number;
  timeout: number;
}) => OpenAIClient;
type OpenAIModule =
  | OpenAIConstructor
  | {
      default?: OpenAIConstructor;
      OpenAI?: OpenAIConstructor;
    };

let cachedOpenAIConstructor: OpenAIConstructor | null | undefined;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function truncateText(value: string, maxChars: number) {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars)}\n\n[truncated]`;
}

function toMultilineText(lines: string[] | undefined) {
  if (!lines?.length) {
    return [];
  }

  return lines.map((line) => truncateText(line, MAX_TEXT_CHARS));
}

function summarizeStatement(task: WorkspaceTask) {
  return task.statement.map((block) => ({
    title: block.title,
    paragraphs: toMultilineText(block.paragraphs),
    bullets: toMultilineText(block.bullets),
  }));
}

function summarizeVerdict(verdict: AiReviewVerdictInput) {
  return {
    mode: verdict.mode,
    suite: verdict.suite,
    outputVisibility: verdict.outputVisibility,
    score: verdict.score,
    passed: verdict.passed,
    total: verdict.total,
    blocked: verdict.blocked,
    blockReason: verdict.blockReason ?? null,
    resourceExceeded: verdict.resourceExceeded ?? false,
    resourceMessage: verdict.resourceMessage ?? null,
    terminatedEarly: verdict.terminatedEarly ?? false,
    results: verdict.results.slice(0, 10).map((result) => ({
      label: result.label,
      passed: result.passed,
      timedOut: result.timedOut,
      stderr: truncateText(result.stderr, 800),
      actualOutput:
        verdict.outputVisibility === "full"
          ? truncateText(result.actualOutput ?? "", 1_200)
          : undefined,
      expectedOutput:
        verdict.outputVisibility === "full"
          ? truncateText(result.expectedOutput ?? "", 1_200)
          : undefined,
      resourceExceeded: result.resourceExceeded ?? false,
      resourceMessage: result.resourceMessage ?? null,
    })),
  };
}

function hasOpenAIApiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function getOpenAIConstructor() {
  if (cachedOpenAIConstructor !== undefined) {
    return cachedOpenAIConstructor;
  }

  try {
    const loadedModule = nodeRequire("openai") as OpenAIModule;
    const OpenAI =
      typeof loadedModule === "function"
        ? loadedModule
        : loadedModule.default ?? loadedModule.OpenAI;

    cachedOpenAIConstructor = typeof OpenAI === "function" ? OpenAI : null;
  } catch {
    cachedOpenAIConstructor = null;
  }

  return cachedOpenAIConstructor;
}

function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const OpenAI = getOpenAIConstructor();

  if (!apiKey || !OpenAI) {
    return null;
  }

  return new OpenAI({
    apiKey,
    maxRetries: 1,
    timeout: 30_000,
  });
}

function getModelName() {
  return process.env.OPENAI_REVIEW_MODEL?.trim() || DEFAULT_REVIEW_MODEL;
}

function readCompletionText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (
          part &&
          typeof part === "object" &&
          "type" in part &&
          (part as { type?: string }).type === "text" &&
          "text" in part &&
          typeof (part as { text?: string }).text === "string"
        ) {
          return (part as { text: string }).text;
        }

        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

function extractJsonObject(raw: string) {
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new Error("Empty AI review response.");
  }

  const fenced = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  if (fenced.startsWith("{") && fenced.endsWith("}")) {
    return fenced;
  }

  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return fenced.slice(start, end + 1);
  }

  throw new Error("AI review response did not contain a JSON object.");
}

function coerceString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function coerceStringArray(value: unknown, fallback: string[], maxItems: number) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, maxItems);

  return normalized.length ? normalized : fallback;
}

function coerceSeverity(value: unknown): AiReviewSeverity {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

function coerceFindings(value: unknown, fallback: AiReviewFinding[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const finding = item as {
        title?: unknown;
        severity?: unknown;
        detail?: unknown;
      };

      return {
        title: coerceString(finding.title, "Megfigyelés"),
        severity: coerceSeverity(finding.severity),
        detail: coerceString(
          finding.detail,
          "A review nem adott részletes indoklást ehhez a ponthoz.",
        ),
      } satisfies AiReviewFinding;
    })
    .filter((finding): finding is AiReviewFinding => Boolean(finding))
    .slice(0, 5);

  return normalized.length ? normalized : fallback;
}

function coerceImprovedExample(value: unknown): AiReviewImprovedExample | undefined {
  if (typeof value === "string") {
    const code = value.trim();

    return code ? { code } : undefined;
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as {
    code?: unknown;
    explanation?: unknown;
  };
  const code = coerceString(candidate.code, "");

  if (!code) {
    return undefined;
  }

  const explanation =
    typeof candidate.explanation === "string" && candidate.explanation.trim()
      ? candidate.explanation.trim()
      : undefined;

  return {
    code,
    explanation,
  };
}

function normalizeReviewPayload(
  rawReview: unknown,
  verdict: AiReviewVerdictInput,
): GeneratedAiReview {
  const fallbackScore = clamp(Math.round(verdict.score), 0, 100);
  const fallbackFindings: AiReviewFinding[] = [
    {
      title: verdict.blocked ? "A futás blokkolt volt" : "További csiszolás javasolt",
      severity: verdict.blocked ? "high" : "medium",
      detail: verdict.blocked
        ? "A deterministic judge blokkolta vagy megszakította a futást, ezért először a végrehajtási problémát kell rendbe tenni."
        : "Az AI reviewhez érkezett strukturált válasz hiányos volt, ezért konzervatív értelmezés készült a judge eredménye alapján.",
    },
  ];

  if (!rawReview || typeof rawReview !== "object") {
    return {
      score: fallbackScore,
      summary:
        verdict.score === 100
          ? "A megoldás a jelenlegi judge körben átment, de érdemes még a tisztaságot és a vizsgastílust is külön átnézni."
          : "A megoldás még nem stabil minden ellenőrzésen, ezért a fő logikai és formázási kockázatokat érdemes célzottan javítani.",
      strengths:
        verdict.score === 100
          ? ["A jelenlegi judge körben a megoldás átment."]
          : ["A kód már részben követi a feladat fő szerkezetét."],
      findings: fallbackFindings,
      tips: [
        "Futtasd újra a megoldást célzott saját szélső esetekkel is.",
        "Ellenőrizd külön a kimeneti formát és a feltételkezelés határértékeit.",
      ],
      nextStep:
        verdict.score === 100
          ? "Nézd át, hogy a kód olvashatósága és változónevei vizsgakörnyezetben is stabilak-e."
          : "Javítsd először a judge által leginkább érintett logikai vagy formázási hibát, és csak utána kérj új review-t.",
      improvedExample: undefined,
    };
  }

  const review = rawReview as {
    score?: unknown;
    summary?: unknown;
    strengths?: unknown;
    findings?: unknown;
    tips?: unknown;
    nextStep?: unknown;
    improvedExample?: unknown;
  };

  const numericScore =
    typeof review.score === "number" && Number.isFinite(review.score)
      ? clamp(Math.round(review.score), 0, 100)
      : fallbackScore;

  return {
    score: numericScore,
    summary: coerceString(
      review.summary,
      fallbackScore === 100
        ? "A kód a judge szerint rendben fut, az AI review pedig vizsgaszempontból is használható alapnak látja."
        : "A megoldás még javítást igényel, főleg a pontvesztést okozó logikai vagy formai részeken.",
    ),
    strengths: coerceStringArray(
      review.strengths,
      fallbackScore === 100
        ? ["A deterministic judge körben a megoldás sikeresen teljesített."]
        : ["A kód már tartalmaz működő részmegoldásokat."],
      4,
    ),
    findings: coerceFindings(review.findings, fallbackFindings),
    tips: coerceStringArray(
      review.tips,
      [
        "Futtasd újra a megoldást saját szélső esetekkel is.",
        "A formázást és a feltételhatárokat külön ellenőrizd a beadás előtt.",
      ],
      5,
    ),
    nextStep: coerceString(
      review.nextStep,
      fallbackScore === 100
        ? "Nézd át még egyszer a kód olvashatóságát és a vizsgán is jól követhető szerkezetét."
        : "Javítsd a legkritikusabb hibát, futtasd újra a judge-ot, és csak utána kérj új review-t.",
    ),
    improvedExample: coerceImprovedExample(review.improvedExample),
  };
}

function buildReviewMessages(
  task: WorkspaceTask,
  code: string,
  verdict: AiReviewVerdictInput,
): OpenAIMessage[] {
  const developerMessage = [
    "Te egy magyar nyelven válaszoló, SZIGORÚ Python érettségi kódreviewer vagy.",
    "A célod rövid, használható, vizsgafókuszú, kritikusan kalibrált visszajelzés adása a beküldött megoldásról.",
    "Mindig magyarul válaszolj.",
    "Kizárólag egyetlen JSON objektumot adj vissza, magyarázó szöveg vagy markdown nélkül.",
    'A JSON kötelező mezői ezek legyenek: {"score": number, "summary": string, "strengths": string[], "findings": [{"title": string, "severity": "low"|"medium"|"high", "detail": string}], "tips": string[], "nextStep": string}.',
    'Opcionálisan adhatsz még egy improvedExample mezőt is ebben a formában: {"code": string, "explanation": string}.',
    "Az improvedExample nem kötelező. Csak akkor add meg, ha valóban tudsz rövid, javított, vizsgastílusú Python példát mutatni ugyanarra a feladatra.",
    "Ha adsz improvedExample mezőt, a code legyen önmagában is hasznos és a feladat input/output modelljéhez illeszkedő példa.",

    "A deterministic judge eredményét kezeld elsődleges igazságforrásként.",
    "Ha a judge részben vagy teljesen bukik, a score maradjon egyértelműen közepes vagy alacsony.",
    "Ne találj ki konkrét nem látott rejtett teszteket. Hidden bukás esetén általános megbízhatósági kockázatként fogalmazz.",
    "Ne jutalmazd túl a részben jó megoldásokat.",

    "Pontozási elv:",
    "0-20: futtathatatlan, blokkolt, súlyos judge hiba, alaplogika hibás.",
    "21-40: jelentős hibák, több judge bukás, megbízhatatlan megoldás.",
    "41-60: részben működik, de több logikai/stílusbeli/robosztussági probléma van.",
    "61-75: alapvetően működik, de vizsgaszinten több érdemi kifogás van.",
    "76-89: jó megoldás, kisebb hibákkal vagy tisztasági gondokkal.",
    "90-96: nagyon jó, tiszta, stabil, vizsgabiztos megoldás.",
    "97-100: kivételesen jó, csak akkor adható, ha a judge hibátlan ÉS a kód tiszta, következetes, jól olvasható, vizsgastílusú, felesleges kockázatok nélkül.",
    "100 pont rendkívül ritka. Ha bármilyen érdemi kifogás van, nem adhatsz 100-at.",
    "Ha a judge nem tökéletes, a score nem lehet 90 felett.",
    "Ha hidden suite bukott, a score nem lehet 75 felett.",
    "Ha van legalább egy high severity finding, a score nem lehet 70 felett.",
    "Ha van több medium finding, a score általában ne menjen 80 fölé.",

    "Légy kifejezetten szigorú ezekben: logikai hibák, peremesetek figyelmen kívül hagyása, bemeneti feltételezések, rossz változónevek, Python beépített nevek felülírása, felesleges bonyolítás, nem vizsgastílusú minták, olvashatóság, formázás, következetlenség.",
    "A score ne a szándékot, hanem a tényleges minőséget tükrözze.",
    "Ne dicsérj általánosságban. Csak konkrét, igazolható erősséget említs.",
    "A strengths lista 2-4 elem, de ne legyen üres frázis.",
    "A findings lista 2-5 elem legyen, és legyen valóban kritikus.",
    "A tips lista 2-5 konkrét, javítható tanács legyen.",
    "A summary legfeljebb 3 rövid mondat legyen.",
    "Ha improvedExample mezőt adsz, az explanation legfeljebb 2 rövid mondat legyen.",
  ].join(' ');

  const userPayload = {
    task: {
      id: task.id,
      title: task.title,
      level: task.level,
      family: task.family,
      summary: truncateText(task.summary, MAX_TEXT_CHARS),
      skillFocus: task.skillFocus.slice(0, 8),
      statement: summarizeStatement(task),
      inputFormat: toMultilineText(task.inputFormat),
      outputFormat: toMultilineText(task.outputFormat),
      editorTips: toMultilineText(task.editorTips),
      providedFiles: task.providedFiles?.map((file) => ({
        path: file.path,
        description: truncateText(file.description, 300),
      })),
    },
    verdict: summarizeVerdict(verdict),
    code: truncateText(code, MAX_CODE_CHARS),
  };

  return [
    {
      role: "developer" as const,
      content: developerMessage,
    },
    {
      role: "user" as const,
      content: JSON.stringify(userPayload, null, 2),
    },
  ];
}

export function isAiReviewAvailable() {
  return hasOpenAIApiKey() && isAiReviewDependencyInstalled();
}

export function isAiReviewDependencyInstalled() {
  return Boolean(getOpenAIConstructor());
}

export function getAiReviewUnavailableReason() {
  if (!hasOpenAIApiKey() && !isAiReviewDependencyInstalled()) {
    return "Az AI review nincs teljesen bekötve ezen a környezeten: hiányzik az OPENAI_API_KEY és az openai csomag is.";
  }

  if (!hasOpenAIApiKey()) {
    return "Az AI reviewhez OPENAI_API_KEY szükséges ezen a környezeten.";
  }

  if (!isAiReviewDependencyInstalled()) {
    return "Az AI reviewhez az openai csomagnak is telepítve kell lennie ezen a környezeten.";
  }

  return null;
}

export function getAiReviewQuota(usedCount: number): AiReviewQuota {
  const safeUsed = clamp(Math.trunc(Number.isFinite(usedCount) ? usedCount : 0), 0, AI_REVIEW_LIMIT);

  return {
    limit: AI_REVIEW_LIMIT,
    used: safeUsed,
    remaining: AI_REVIEW_LIMIT - safeUsed,
  };
}

export function readAiReviewQuota(cookieValue?: string | null) {
  const parsed = Number.parseInt(cookieValue ?? "0", 10);
  return getAiReviewQuota(Number.isFinite(parsed) ? parsed : 0);
}

export function getAiReviewModel() {
  return getModelName();
}

export async function generateAiReview(options: {
  task: WorkspaceTask;
  code: string;
  verdict: AiReviewVerdictInput;
}): Promise<AiReviewResult> {
  const client = createOpenAIClient();

  if (!client) {
    throw new Error(getAiReviewUnavailableReason() ?? "Az OpenAI kliens nem érhető el.");
  }

  const completion = await client.chat.completions.create({
    model: getModelName(),
    temperature: 1,
    messages: buildReviewMessages(options.task, options.code, options.verdict),
  });

  const rawContent = readCompletionText(completion.choices[0]?.message?.content);
  const rawJson = extractJsonObject(rawContent);
  const parsed = JSON.parse(rawJson) as unknown;
  const normalized = normalizeReviewPayload(parsed, options.verdict);

  return {
    ...normalized,
    createdAt: new Date().toISOString(),
    model: completion.model,
    requestId: completion._request_id ?? null,
    basedOn: {
      judgeScore: options.verdict.score,
      passed: options.verdict.passed,
      total: options.verdict.total,
      mode: options.verdict.mode,
      suite: options.verdict.suite,
    },
  };
}