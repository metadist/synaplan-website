# Synaplan Website

Marketing and product pages for [Synaplan](https://synaplan.com) — the open-source enterprise AI platform. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, `next-intl` (EN/DE), Prisma ORM, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| React | 19.2 with Server Components |
| Styling | Tailwind CSS v4 + shadcn/ui v4 (Base UI) |
| Animations | Framer Motion |
| i18n | next-intl — EN (default, no prefix) + DE (`/de/`) |
| Database | PostgreSQL 16 via Prisma ORM 7 |
| Auth (Admin) | HMAC-signed session cookies (bcrypt, no JWT lib needed) |
| Testing | Vitest |
| Container | Docker + Docker Compose |

---

## Quickstart (local, without database)

For the public marketing site only (no blog, no admin):

```bash
npm install
npm run dev
```

Open **http://localhost:3000** (EN), **http://localhost:3000/de** (DE).

---

## Quickstart (full stack — with blog + admin)

### 1. Copy environment variables

```bash
cp .env.example .env.local
```

Fill in at minimum:

```env
DATABASE_URL=postgresql://synaplan:changeme@localhost:5432/synaplan_web
ADMIN_SESSION_SECRET=<openssl rand -hex 32>
```

### 2. Start PostgreSQL (Docker)

```bash
docker compose up db -d
```

### 3. Run database migrations

```bash
npm run db:generate    # generate Prisma client
npm run db:migrate     # create tables
```

### 4. Create the first admin user

```bash
ADMIN_SEED_PASSWORD="your-secure-password" npm run db:seed
```

### 5. Start dev server

```bash
npm run dev
```

Open:
- **http://localhost:3000** — public website
- **http://localhost:3000/admin** — admin panel (login with seeded credentials)
- **http://localhost:3000/blog** — public blog listing

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build (standalone) |
| `npm run start` | Production server (after build) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Create + apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Create initial admin user |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `./scripts/sync-public-to-remote.sh` | Rsync `public/` to a server (env vars in script header) |

---

## Admin Panel (`/admin`)

A simple, integrated CMS for managing blog posts.

### Features
- **Dashboard** — post stats, recent posts, view counts
- **Post list** — filterable by status (draft/published/archived) and locale
- **Post editor** — Markdown editor with live preview, auto-slug, tag management
- **AI Write** — generate or expand blog content via the Synaplan API (streaming)
- **Analytics** — Cloudflare Zaraz stats widget

### Authentication
Admin access is protected by a signed session cookie (`ADMIN_SESSION_SECRET`).  
First login: use the credentials created by `npm run db:seed`.

### AI Writing
The AI panel in the editor connects to the Synaplan API (same `SYNAPLAN_DEMO_BEARER_TOKEN` as the public demo chat). Three modes:
- **Full** — writes a complete Markdown blog post
- **Outline** — generates a structured outline
- **Expand** — expands a draft paragraph

---

## Blog

### Public blog (`/blog`, `/de/blog`)
- Post listing filtered by locale
- Individual posts at `/blog/[slug]`
- Markdown rendering with `react-markdown` + GitHub Flavored Markdown
- `BlogPosting` JSON-LD schema for SEO
- View counter (incremented on each visit)

### Content workflow
1. Write or generate a post in `/admin/posts/new`
2. Set locale (`de` or `en`), tags, excerpt, cover image
3. Save as **Draft** → preview at `/blog/[slug]` (only visible when Published)
4. Set status to **Published** to go live

---

## Environment Variables

See [`.env.example`](./.env.example) for all variables with explanations.

**Required for blog + admin:**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_SESSION_SECRET` | Session cookie signing key (min. 32 chars) |

**Required for AI writing & demo chat:**

| Variable | Purpose |
|---|---|
| `SYNAPLAN_API_BASE_URL` | Synaplan API base URL |
| `SYNAPLAN_DEMO_BEARER_TOKEN` | API bearer token |
| `DEMO_CHAT_SESSION_SECRET` | Demo chat cookie signing key (min. 16 chars) |

**Optional integrations:**

| Variable | Purpose |
|---|---|
| `CLOUDFLARE_ZARAZ_TOKEN` | Cloudflare Analytics API token |
| `CLOUDFLARE_ZARAZ_SITE_ID` | Cloudflare Zone ID |
| `NEXT_PUBLIC_CLOUDFLARE_RECAPTCHA_KEY` | Turnstile site key |
| `CLOUDFLARE_RECAPTCHA_SECRET` | Turnstile secret |
| `GITHUB_WEBHOOK_SECRET` | GitHub webhook HMAC secret |
| `GITHUB_TOKEN` | GitHub API token (for stats refresh) |

---

## Docker

### Full stack (Next.js + PostgreSQL)

```bash
# Copy and configure environment variables
cp .env.example .env

# Start everything (db → migrations → app)
docker compose up -d
```

The compose file starts three services in order:
1. `db` — PostgreSQL 16
2. `migrate` — runs `prisma migrate deploy`
3. `web` — Next.js production server

Blog/admin image uploads go to `public/uploads/`. **Production** (`docker-compose.prod.yml`): bind-mounts the host directory `${SYNAPLAN_UPLOADS_HOST_PATH:-/wwwroot/synaplan.com/public/uploads}` → `/app/public/uploads`. Create it on the server and allow the container user (`nextjs`, uid **1001**): `mkdir -p /wwwroot/synaplan.com/public/uploads && chown -R 1001:1001 /wwwroot/synaplan.com/public/uploads`. **Local Compose** uses `./public/uploads` the same way. Sync from your laptop with `./scripts/sync-public-to-remote.sh` (see script header).

Then seed the admin user:
```bash
docker compose exec web sh -c "ADMIN_SEED_PASSWORD=yourpassword npx tsx prisma/seed.ts"
```

### App only (if you have an external database)

```bash
docker build -t synaplan-website .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e ADMIN_SESSION_SECRET="..." \
  synaplan-website
```

### What the `Dockerfile` does

1. **`deps`** — `npm ci` for reproducible installs
2. **`builder`** — `prisma generate` then `next build` → `.next/standalone`
3. **`runner`** — slim Alpine image, non-root user, `node server.js`

---

## Database Schema

```
AdminUser
  id, email (unique), name, password (bcrypt), createdAt, updatedAt

Post
  id, slug (unique), title, excerpt, content (text), coverImage
  status (DRAFT | PUBLISHED | ARCHIVED), locale (de | en)
  tags[], views, publishedAt, createdAt, updatedAt
  authorId → AdminUser
```

Migrations live in `prisma/migrations/`. Run `npm run db:migrate` (dev) or `npm run db:migrate:deploy` (prod) to apply.

---

## Testing

```bash
npm run test          # run all tests once
npm run test:watch    # interactive watch mode
```

Test files live in `src/__tests__/`:
- `admin-session.test.ts` — HMAC session signing / verification
- `posts-api.test.ts` — slug generation logic
- `synaplan-demo-api.test.ts` — API helpers (token normalization, response parsing)

---

## Architecture Notes

### Rendering modes
- **Static (SSG)** — all marketing pages (`/`, `/features/*`, `/about/*`, `/solutions/*`, `/pricing`)
- **Dynamic (SSR)** — blog listing + posts, admin pages (require live database)
- **API Routes** — `src/app/api/` (admin CRUD, AI write, auth, GitHub webhook, health)

### Middleware (`proxy.ts`)
Next.js 16 uses `proxy.ts` (not `middleware.ts`) as the middleware entry point.  
Our `proxy.ts` chains two concerns:
1. **Admin guard** — redirects unauthenticated users from `/admin/*` to `/admin/login`
2. **i18n routing** — handled by `next-intl` for all other routes

### Internationalization
- Default locale: **English** (no URL prefix)
- German: `/de/...`
- Translation files: `src/messages/en.json`, `src/messages/de.json`
- Server components: `getTranslations()` | Client components: `useTranslations()`

### JSON-LD & SEO
Structured data builders live in `src/lib/jsonld.ts`:
- `Organization`, `WebSite` — injected in root layout
- `SoftwareApplication` — homepage
- `Service` + `BreadcrumbList` — solution and feature pages
- `FAQPage` — homepage FAQ section
- `Product` + `Offer` — pricing page
- `BlogPosting` — individual blog posts
- `AboutPage`, `Person` — about pages

---

## Project conventions

See [`AGENTS.md`](./AGENTS.md) for coding standards, component patterns, and design system conventions used by AI agents and developers alike.
