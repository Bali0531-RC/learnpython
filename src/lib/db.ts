import "server-only";

import { Prisma, PrismaClient } from "@prisma/client";

type DatabaseRuntimeState = {
  disabled: boolean;
  disabledReason: string | null;
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaRuntimeState?: DatabaseRuntimeState;
};

const databaseRuntimeState = globalForPrisma.prismaRuntimeState ?? {
  disabled: false,
  disabledReason: null,
};

if (!globalForPrisma.prismaRuntimeState) {
  globalForPrisma.prismaRuntimeState = databaseRuntimeState;
}

function getDatabaseErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown database error";
}

function isSchemaMissingError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2021" || error.code === "P2022";
  }

  const message = getDatabaseErrorMessage(error).toLowerCase();

  return message.includes("does not exist") || message.includes("relation") || message.includes("table");
}

function isDatabaseUnavailableError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1001";
  }

  const message = getDatabaseErrorMessage(error).toLowerCase();

  return (
    message.includes("can't reach database server") ||
    message.includes("econnrefused") ||
    message.includes("p1001")
  );
}

function shouldDisableDatabaseQueries(error: unknown) {
  return isSchemaMissingError(error) || isDatabaseUnavailableError(error);
}

function disableDatabaseQueries(error: unknown) {
  databaseRuntimeState.disabled = true;
  databaseRuntimeState.disabledReason = getDatabaseErrorMessage(error);
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function canQueryDatabase() {
  return isDatabaseConfigured() && !databaseRuntimeState.disabled;
}

export function getDatabaseRuntimeState() {
  return { ...databaseRuntimeState };
}

export async function runWithDatabaseFallback<T>(query: () => Promise<T>): Promise<T | null> {
  if (!canQueryDatabase()) {
    return null;
  }

  try {
    return await query();
  } catch (error) {
    if (shouldDisableDatabaseQueries(error)) {
      disableDatabaseQueries(error);
    }

    return null;
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}