import {
  getAiReviewGlobalTokenQuota,
  getAiReviewModel,
  isAiReviewAvailable,
  isAiReviewDependencyInstalled,
  isAiReviewQuotaStoreConfigured,
} from "@/lib/ai-review";
import { db } from "@/lib/db";

async function getAiReviewHealth() {
  const hasApiKey = Boolean(process.env.OPENAI_API_KEY?.trim());

  try {
    const globalTokenQuota = isAiReviewQuotaStoreConfigured()
      ? await getAiReviewGlobalTokenQuota()
      : undefined;

    return {
      ok: isAiReviewAvailable(),
      hasApiKey,
      packageInstalled: isAiReviewDependencyInstalled(),
      quotaStoreConfigured: isAiReviewQuotaStoreConfigured(),
      model: getAiReviewModel(),
      quotaMode: "browser-cookie-20 + redis-global-total-tokens-24h",
      globalTokenQuota,
    };
  } catch (error) {
    return {
      ok: false,
      hasApiKey,
      packageInstalled: isAiReviewDependencyInstalled(),
      quotaStoreConfigured: isAiReviewQuotaStoreConfigured(),
      model: getAiReviewModel(),
      quotaMode: "browser-cookie-20 + redis-global-total-tokens-24h",
      quotaError: error instanceof Error ? error.message : "Ismeretlen AI quota hiba.",
    };
  }
}

function resolveDatabaseHealthError(error: unknown) {
  if (!process.env.DATABASE_URL) {
    return {
      error:
        "A DATABASE_URL nincs beállítva. Hozd létre a .env fájlt az .env.example alapján, majd indítsd el vagy kösd be a PostgreSQL adatbázist.",
      nextSteps: [
        "cp .env.example .env",
        "npm run db:push",
        "npm run db:seed",
      ],
    };
  }

  const message = error instanceof Error ? error.message : "Ismeretlen adatbázishiba.";

  if (
    message.includes("Can't reach database server") ||
    message.includes("P1001") ||
    message.includes("ECONNREFUSED")
  ) {
    return {
      error:
        "A PostgreSQL jelenleg nem érhető el. Indítsd el a db szolgáltatást, majd futtasd újra a schema push és seed parancsokat.",
      nextSteps: ["docker compose up -d db", "npm run db:push", "npm run db:seed"],
    };
  }

  if (
    message.includes("does not exist") ||
    message.includes("relation") ||
    message.includes("table")
  ) {
    return {
      error:
        "Az adatbázis elérhetőnek tűnik, de a Prisma séma még nincs alkalmazva vagy a seed még nem futott le.",
      nextSteps: ["npm run db:push", "npm run db:seed"],
    };
  }

  return {
    error: "Az adatbázis kapcsolat vagy a Prisma séma még nincs előkészítve.",
    details: message,
    nextSteps: ["npm run db:push", "npm run db:seed"],
  };
}

export async function GET() {
  const judgeUrl = process.env.JUDGE_API_URL ?? "http://127.0.0.1:8001";
  const aiReviewHealth = await getAiReviewHealth();

  try {
    const [lessons, lessonLinks, tasks, archiveEntries, profiles, submissions] =
      await db.$transaction([
        db.lesson.count(),
        db.lessonResourceLink.count(),
        db.task.count(),
        db.archiveEntry.count(),
        db.userProfile.count(),
        db.submission.count(),
      ]);

    return Response.json({
      ok: true,
      app: "kodrettsegi-web",
      judgeUrl,
      aiReview: aiReviewHealth,
      database: {
        ok: true,
        provider: "postgresql",
        counts: {
          lessons,
          lessonLinks,
          tasks,
          archiveEntries,
          profiles,
          submissions,
        },
      },
    });
  } catch (error) {
    const databaseError = resolveDatabaseHealthError(error);

    return Response.json({
      ok: true,
      app: "kodrettsegi-web",
      judgeUrl,
      aiReview: aiReviewHealth,
      database: {
        ok: false,
        provider: "postgresql",
        ...databaseError,
      },
    });
  }
}