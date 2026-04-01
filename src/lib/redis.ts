import "server-only";

import { createClient } from "redis";

type AppRedisClient = ReturnType<typeof createClient>;

const globalForRedis = globalThis as unknown as {
  redisClient?: AppRedisClient;
  redisConnectPromise?: Promise<AppRedisClient> | null;
};

export function isRedisConfigured() {
  return Boolean(process.env.REDIS_URL?.trim());
}

function createRedisClient() {
  const client = createClient({
    url: process.env.REDIS_URL?.trim(),
  });

  client.on("error", (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("Redis client error", error);
    }
  });

  return client;
}

export async function getRedisClient() {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!globalForRedis.redisClient) {
    globalForRedis.redisClient = createRedisClient();
  }

  const client = globalForRedis.redisClient;

  if (client.isOpen) {
    return client;
  }

  if (!globalForRedis.redisConnectPromise) {
    globalForRedis.redisConnectPromise = client.connect().then(() => client);
  }

  try {
    return await globalForRedis.redisConnectPromise;
  } finally {
    globalForRedis.redisConnectPromise = null;
  }
}