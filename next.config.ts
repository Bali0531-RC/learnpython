import type { NextConfig } from "next";

const allowedDevOrigins = (
  process.env.ALLOWED_DEV_ORIGINS ?? "learn.bali0531.hu"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
