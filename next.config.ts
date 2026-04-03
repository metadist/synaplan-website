import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security headers that also serve as trust signals for Google.
 * HSTS, CSP, and referrer policy improve Core Web Vitals scoring
 * and are considered positive E-E-A-T signals.
 */
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Control referrer information sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // DNS prefetch for performance
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Permissions policy — disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS — force HTTPS (only activate when HTTPS is guaranteed in prod)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /** Minimal Node server bundle – works with `node server.js` and Docker. */
  output: "standalone",

  logging: {
    browserToTerminal: "warn",
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // Optimise remote images from GitHub avatars / CDN if needed later
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Trailing-slash normalisation — avoids duplicate content penalties
      {
        source: "/de/",
        destination: "/de",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
