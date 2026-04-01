# Synaplan Website

Marketing and product pages for [Synaplan](https://synaplan.com): Next.js 16 (App Router), React 19, Tailwind CSS v4, `next-intl` for EN/DE.

---

## Quickstart (local)

Prerequisites: **Node.js 22+** (recommended), **npm**.

```bash
npm install
npm run dev
```

The app runs at **http://localhost:3000** (English homepage without prefix, German at `/de`).

| Command | Purpose |
|--------|--------|
| `npm run dev` | Dev server with Turbopack, hot reload |
| `npm run build` | Production build (`standalone` + optimized assets) |
| `npm run start` | Production server (after `build`, port **3000** by default) |
| `npm run lint` | ESLint |

---

## Technical: How Next.js & SSR work together here

### App Router & rendering modes

- **`src/app/`** follows the **App Router**. Layouts (`layout.tsx`) and pages (`page.tsx`) form the route hierarchy.
- **Server Components** are the default: data can be loaded on the server; HTML is generated **on the server** for the first response (better for SEO and first paint).
- **`"use client"`** marks **Client Components** (interaction, `useState`, browser APIs, Framer Motion). They are pre-rendered in the SSR HTML and **hydrated** in the browser (React attaches event handlers and state to the DOM).
- **`generateStaticParams`** (e.g. in `src/app/[locale]/layout.tsx`) tells Next.js which `[locale]` variants can be **pre-rendered at build time** (SSG).

In short: many pages are **statically pre-rendered** (SSG). Where dynamic data or request-time logic is needed, **Server Components** or **Route Handlers** (`src/app/api/...`) can run **on the server** without shipping the full bundle to the browser.

### Internationalization

- **`next-intl`** with routing under `src/i18n/`: default locale **English** without a URL prefix, German at **`/de/...`**.
- `proxy.ts` (project convention, not `middleware.ts`) handles locale/redirects for the Next.js version in this repo.

### Production output & Docker

- In **`next.config.ts`**, **`output: "standalone"`** is set. `next build` then produces a **minimal Node server** (`server.js`) under **`.next/standalone`** including traced dependencies—ideal for containers.
- **`outputFileTracingRoot`** and **`turbopack.root`** point at the **project directory** (folder containing `next.config.ts`). This keeps the standalone output flat if another `package-lock.json` exists higher in the filesystem (otherwise Next warns and nests paths).
- **`npm run start`** uses the normal Next production server; the Docker image explicitly starts **`node server.js`** from the standalone folder (see `Dockerfile`).

---

## Docker

### Build and run the image

```bash
docker compose build
docker compose up
```

Open **http://localhost:3000**.

### `docker build` only

```bash
docker build -t synaplan-website .
docker run --rm -p 3000:3000 synaplan-website
```

### What the `Dockerfile` does (short)

1. **Stage `deps`:** `npm ci` for reproducible dependencies.
2. **Stage `builder`:** `npm run build` → produces `.next/standalone`, `.next/static`, `public`.
3. **Stage `runner`:** slim **Alpine** image, non-root user `nextjs`, start with **`node server.js`**, **`HOSTNAME=0.0.0.0`** so the port is reachable inside the container.

Static assets: `public/` and `.next/static/` are copied into the standalone layout as intended by Next.js for `standalone`.

### Optional environment variables (demo chat / APIs)

For local or container runs with the demo chat backend, you can set (see `src/lib/synaplan-demo-api.ts`):

- `SYNAPLAN_API_BASE_URL`
- `SYNAPLAN_DEMO_BEARER_TOKEN`
- `DEMO_CHAT_SESSION_SECRET`

In **docker-compose**, you can add a `.env` file and enable the commented `env_file` section in `docker-compose.yml`.

---

## More notes

- Project conventions: **`AGENTS.md`**
- Deployment on Vercel remains possible; `standalone` is supported there.
