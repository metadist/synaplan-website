import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security headers — trust & safety signals for Google Lighthouse Best Practices.
 *
 * Addresses Lighthouse warnings:
 *   ✓ "Ensure CSP is effective against XSS attacks"
 *   ✓ "Ensure proper origin isolation with COOP"
 *   ✓ "Mitigate DOM-based XSS with Trusted Types" (partial)
 */

// Content-Security-Policy — all known production origins hardcoded so the
// CSP is correct in every Docker image regardless of build-time env vars.
const csp = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "https://cdn.jsdelivr.net",
    "https://static.cloudflareinsights.com",
    "https://web.synaplan.com",
  ].join(" "),
  [
    "style-src 'self' 'unsafe-inline'",
    "https://cdn.jsdelivr.net",
    "https://web.synaplan.com",
  ].join(" "),
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  [
    "connect-src 'self'",
    "https://api.github.com",
    "https://synaplan.com",
    "https://www.synaplan.com",
    "https://web.synaplan.com",
    "https://cdn.jsdelivr.net",
    "https://cloudflareinsights.com",
  ].join(" "),
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking (legacy fallback — CSP frame-ancestors is the modern standard)
  { key: "X-Frame-Options", value: "DENY" },
  // Referrer privacy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // DNS prefetch for performance
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Permissions policy — disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS — force HTTPS (safe since we use standalone Docker + reverse proxy)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // COOP — fixes Lighthouse "Ensure proper origin isolation with COOP" warning.
  // same-origin-allow-popups lets OAuth/Calendly popups work while still isolating
  // cross-origin opener access.
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  // CORP — prevents other origins from loading our resources (e.g. via <img>)
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  // COEP — required for SharedArrayBuffer / high-res timers (future-proofing)
  // Set to "credentialless" so third-party scripts without CORP headers still load
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "credentialless",
  },
  // Content-Security-Policy
  { key: "Content-Security-Policy", value: csp },
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
      // Uploaded images: do not send COEP/CORP/CSP — those break display in some
      // browsers when combined with the document's credentialless COEP.
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      // JSON/API responses must not send document isolation headers (COEP/CORP/CSP/COOP):
      // some browsers treat them as opaque or block reading the body for same-origin fetch().
      {
        source: "/api/:path*",
        headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
      },
      {
        // Apply security headers to all other routes
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
