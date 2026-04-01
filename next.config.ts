import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /** Minimal Node server bundle for Docker (`node server.js`); Vercel-compatible. */
  output: "standalone",
  /** Keeps traced files under this repo when another lockfile exists higher up (fixes standalone layout). */
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  logging: {
    browserToTerminal: "warn",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
