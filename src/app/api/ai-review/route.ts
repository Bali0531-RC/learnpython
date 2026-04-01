import { cookies } from "next/headers";

import type {
  AiReviewRequestPayload,
  AiReviewRouteResponse,
  AiReviewVerdictInput,
} from "@/lib/ai-review-types";
import {
  AI_REVIEW_COOKIE_NAME,
  generateAiReview,
  getAiReviewModel,
  getAiReviewQuota,
  getAiReviewUnavailableReason,
  isAiReviewAvailable,
  readAiReviewQuota,
} from "@/lib/ai-review";
import { getWorkspaceTaskContent } from "@/lib/content-store";

function jsonResponse(body: AiReviewRouteResponse, status = 200) {
  return Response.json(body, { status });
}

function normalizeVerdict(verdict: unknown): AiReviewVerdictInput | null {
  if (!verdict || typeof verdict !== "object") {
    return null;
  }

  const candidate = verdict as Partial<AiReviewVerdictInput>;

  if (
    (candidate.mode !== "run" && candidate.mode !== "submit") ||
    (candidate.suite !== "public" && candidate.suite !== "hidden") ||
    (candidate.outputVisibility !== "full" && candidate.outputVisibility !== "masked") ||
    typeof candidate.score !== "number" ||
    typeof candidate.passed !== "number" ||
    typeof candidate.total !== "number" ||
    !Array.isArray(candidate.results)
  ) {
    return null;
  }

  return {
    mode: candidate.mode,
    suite: candidate.suite,
    outputVisibility: candidate.outputVisibility,
    score: candidate.score,
    passed: candidate.passed,
    total: candidate.total,
    blocked: Boolean(candidate.blocked),
    blockReason: candidate.blockReason ?? null,
    resourceExceeded: Boolean(candidate.resourceExceeded),
    resourceMessage: candidate.resourceMessage ?? null,
    terminatedEarly: Boolean(candidate.terminatedEarly),
    results: candidate.results
      .filter((result): result is NonNullable<(typeof candidate.results)[number]> => Boolean(result))
      .map((result) => ({
        label: typeof result.label === "string" ? result.label : "Teszt",
        passed: Boolean(result.passed),
        expectedOutput:
          typeof result.expectedOutput === "string" ? result.expectedOutput : undefined,
        actualOutput:
          typeof result.actualOutput === "string" ? result.actualOutput : undefined,
        stderr: typeof result.stderr === "string" ? result.stderr : "",
        timedOut: Boolean(result.timedOut),
        resourceExceeded: Boolean(result.resourceExceeded),
        resourceMessage:
          typeof result.resourceMessage === "string" ? result.resourceMessage : null,
      })),
  };
}

export async function GET() {
  const cookieStore = await cookies();
  const quota = readAiReviewQuota(cookieStore.get(AI_REVIEW_COOKIE_NAME)?.value);
  const available = isAiReviewAvailable();

  return jsonResponse({
    ok: true,
    available,
    quota,
    model: getAiReviewModel(),
    error: available ? undefined : getAiReviewUnavailableReason() ?? undefined,
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const quota = readAiReviewQuota(cookieStore.get(AI_REVIEW_COOKIE_NAME)?.value);
  const available = isAiReviewAvailable();

  if (!available) {
    return jsonResponse(
      {
        ok: false,
        available,
        quota,
        model: getAiReviewModel(),
        error:
          getAiReviewUnavailableReason() ??
          "Az AI review még nincs bekapcsolva ezen a környezeten.",
      },
      503,
    );
  }

  if (quota.remaining <= 0) {
    return jsonResponse(
      {
        ok: false,
        available,
        quota,
        model: getAiReviewModel(),
        error: "Ebben a böngészőben elfogyott a 20 darabos AI review keret.",
      },
      429,
    );
  }

  let body: Partial<AiReviewRequestPayload>;

  try {
    body = (await request.json()) as Partial<AiReviewRequestPayload>;
  } catch {
    return jsonResponse(
      {
        ok: false,
        available,
        quota,
        model: getAiReviewModel(),
        error: "A kérés törzse nem értelmezhető JSON-ként.",
      },
      400,
    );
  }

  const taskId = typeof body.taskId === "string" ? body.taskId : "";
  const code = typeof body.code === "string" ? body.code : "";
  const verdict = normalizeVerdict(body.verdict);

  if (!taskId || !code.trim() || !verdict) {
    return jsonResponse(
      {
        ok: false,
        available,
        quota,
        model: getAiReviewModel(),
        error: "Az AI review kéréshez taskId, kód és érvényes verdict szükséges.",
      },
      400,
    );
  }

  const task = await getWorkspaceTaskContent(taskId);

  if (!task) {
    return jsonResponse(
      {
        ok: false,
        available,
        quota,
        model: getAiReviewModel(),
        error: "A megadott feladat nem található az aktuális tartalomtárban.",
      },
      404,
    );
  }

  try {
    const review = await generateAiReview({
      task,
      code: code.trim(),
      verdict,
    });
    const nextQuota = getAiReviewQuota(quota.used + 1);

    cookieStore.set(AI_REVIEW_COOKIE_NAME, String(nextQuota.used), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return jsonResponse({
      ok: true,
      available,
      quota: nextQuota,
      model: getAiReviewModel(),
      review,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ismeretlen AI review hiba történt.";

    return jsonResponse(
      {
        ok: false,
        available,
        quota,
        model: getAiReviewModel(),
        error:
          process.env.NODE_ENV === "development"
            ? `Az AI review hívás meghiúsult: ${message}`
            : "Az AI review kérés most nem futott le. Próbáld meg újra később.",
      },
      502,
    );
  }
}