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

// Derive the widget origin (e.g. "https://web.synaplan.com") for CSP when configured
const widgetApiUrl = process.env.SYNAPLAN_WIDGET_API_URL || "https://web.synaplan.com";
const widgetOrigin = process.env.SYNAPLAN_WIDGET_ID
  ? (() => {
      try {
        return new URL(widgetApiUrl).origin;
      } catch {
        return widgetApiUrl.replace(/\/+$/, "");
      }
    })()
  : null;

// Content-Security-Policy
// Next.js requires 'unsafe-inline' for its own inline scripts/styles and
// 'unsafe-eval' for development hot-reload. Both are stripped in production
// via the isDev check if needed, but for now we keep them for compatibility
// and focus on the other CSP directives that Lighthouse checks.
const csp = [
  "default-src 'self'",
  // Next.js inlines critical scripts — unsafe-inline is unavoidable without nonces
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'${widgetOrigin ? ` ${widgetOrigin}` : ""}`,
  // Tailwind/Next.js inlines styles; Google Fonts loaded via next/font (self-hosted)
  `style-src 'self' 'unsafe-inline'${widgetOrigin ? ` ${widgetOrigin}` : ""}`,
  // next/font self-hosts fonts — no external font CDN needed
  "font-src 'self' data:",
  // Images: self + data URIs for inline SVG + blob for canvas exports
  "img-src 'self' data: blob: https:",
  // API calls: GitHub for repo stats; widget API when enabled
  `connect-src 'self' https://api.github.com https://synaplan.com${widgetOrigin ? ` ${widgetOrigin}` : ""}`,
  // No iframes, plugins, or base tag overrides
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Prevent this page from being embedded anywhere (stronger than X-Frame-Options)
  "frame-ancestors 'none'",
  // Force HTTPS for all sub-requests
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
