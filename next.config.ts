import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /** Minimal Node server bundle – works with `node server.js` and Docker. */
  output: "standalone",
  logging: {
    browserToTerminal: "warn",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
