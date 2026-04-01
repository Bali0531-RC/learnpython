import { cookies } from "next/headers";

import type {
  AiReviewRequestPayload,
  AiReviewRouteResponse,
  AiReviewVerdictInput,
} from "@/lib/ai-review-types";
import {
  AI_REVIEW_COOKIE_NAME,
  generateAiReview,
  getAiReviewGlobalTokenQuota,
  getAiReviewModel,
  getAiReviewQuota,
  getAiReviewUnavailableReason,
  isAiReviewQuotaError,
  isAiReviewAvailable,
  readAiReviewQuota,
} from "@/lib/ai-review";
import { getWorkspaceTaskContent } from "@/lib/content-store";

function jsonResponse(body: AiReviewRouteResponse, status = 200) {
  return Response.json(body, { status });
}

async function getAiReviewRouteState(cookieValue?: string | null) {
  const quota = readAiReviewQuota(cookieValue);

  if (quota.remaining <= 0) {
    return {
      available: false,
      quota,
      globalTokenQuota: undefined,
      model: getAiReviewModel(),
      error: "Ebben a böngészőben elfogyott a 20 darabos AI review keret.",
      status: 429,
    };
  }

  if (!isAiReviewAvailable()) {
    return {
      available: false,
      quota,
      globalTokenQuota: undefined,
      model: getAiReviewModel(),
      error:
        getAiReviewUnavailableReason() ??
        "Az AI review még nincs bekapcsolva ezen a környezeten.",
      status: 503,
    };
  }

  try {
    const globalTokenQuota = await getAiReviewGlobalTokenQuota();

    if (globalTokenQuota.remaining <= 0) {
      return {
        available: false,
        quota,
        globalTokenQuota,
        model: getAiReviewModel(),
        error: "A globális 24 órás AI tokenkeret elfogyott. Várd meg a következő ablakot.",
        status: 429,
      };
    }

    return {
      available: true,
      quota,
      globalTokenQuota,
      model: getAiReviewModel(),
      error: undefined,
      status: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ismeretlen quota store hiba történt.";

    return {
      available: false,
      quota,
      globalTokenQuota: undefined,
      model: getAiReviewModel(),
      error:
        process.env.NODE_ENV === "development"
          ? `Az AI review globális tokenkerete most nem olvasható ki: ${message}`
          : "Az AI review globális tokenkerete most nem érhető el.",
      status: 503,
    };
  }
}

function formatAiReviewError(error: unknown) {
  const message = error instanceof Error ? error.message : "Ismeretlen AI review hiba történt.";

  if (message.toLowerCase().includes("timed out")) {
    return process.env.NODE_ENV === "development"
      ? "Az AI review szolgáltatás nem válaszolt időben a szerveroldali időkorláton belül."
      : "Az AI review szolgáltatás most nem válaszolt időben. Próbáld meg újra kicsit később.";
  }

  return process.env.NODE_ENV === "development"
    ? `Az AI review hívás meghiúsult: ${message}`
    : "Az AI review kérés most nem futott le. Próbáld meg újra később.";
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
  const routeState = await getAiReviewRouteState(cookieStore.get(AI_REVIEW_COOKIE_NAME)?.value);

  return jsonResponse({
    ok: true,
    available: routeState.available,
    quota: routeState.quota,
    globalTokenQuota: routeState.globalTokenQuota,
    model: routeState.model,
    error: routeState.available ? undefined : routeState.error,
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const routeState = await getAiReviewRouteState(cookieStore.get(AI_REVIEW_COOKIE_NAME)?.value);
  const { quota, globalTokenQuota, model } = routeState;

  if (!routeState.available) {
    return jsonResponse(
      {
        ok: false,
        available: false,
        quota,
        globalTokenQuota,
        model,
        error: routeState.error,
      },
      routeState.status,
    );
  }

  let body: Partial<AiReviewRequestPayload>;

  try {
    body = (await request.json()) as Partial<AiReviewRequestPayload>;
  } catch {
    return jsonResponse(
      {
        ok: false,
        available: routeState.available,
        quota,
        globalTokenQuota,
        model,
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
        available: routeState.available,
        quota,
        globalTokenQuota,
        model,
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
        available: routeState.available,
        quota,
        globalTokenQuota,
        model,
        error: "A megadott feladat nem található az aktuális tartalomtárban.",
      },
      404,
    );
  }

  try {
    const result = await generateAiReview({
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
      available: routeState.available,
      quota: nextQuota,
      globalTokenQuota: result.globalTokenQuota,
      model,
      review: result.review,
    });
  } catch (error) {
    if (isAiReviewQuotaError(error)) {
      return jsonResponse(
        {
          ok: false,
          available: false,
          quota,
          globalTokenQuota: error.globalTokenQuota ?? globalTokenQuota,
          model,
          error: error.message,
        },
        error.status,
      );
    }

    return jsonResponse(
      {
        ok: false,
        available: routeState.available,
        quota,
        globalTokenQuota,
        model,
        error: formatAiReviewError(error),
      },
      502,
    );
  }
}