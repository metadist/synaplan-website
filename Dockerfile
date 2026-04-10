# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ─── Builder ──────────────────────────────────────────────────────────────────
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (requires a dummy DATABASE_URL at build time for codegen only)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

# Optional: Synaplan chat widget config baked into static pages at build time.
# Pass via docker compose build args; pages also pick up runtime env via ISR.
ARG SYNAPLAN_WIDGET_ID
ARG SYNAPLAN_WIDGET_API_URL
ARG SYNAPLAN_WIDGET_CONFIG
ENV SYNAPLAN_WIDGET_ID=${SYNAPLAN_WIDGET_ID}
ENV SYNAPLAN_WIDGET_API_URL=${SYNAPLAN_WIDGET_API_URL}
ENV SYNAPLAN_WIDGET_CONFIG=${SYNAPLAN_WIDGET_CONFIG}

# Build Next.js (output: standalone)
RUN npm run build

# ─── Runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Must be writable by nextjs: image uploads go to public/uploads/ (see api/admin/upload).
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Empty Compose volume mounts replace this path; ensure dir exists and is owned by nextjs.
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma schema, config, and migrations (needed for migrate deploy at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
# Prisma CLI for runtime migrations (not traced by Next.js standalone output).
# Must npm-install rather than copy — Prisma 7.x has transitive deps (pathe, @prisma/dev, …).
COPY --from=builder /app/node_modules/prisma/package.json /tmp/prisma-pkg.json
RUN PRISMA_V=$(node -e "console.log(require('/tmp/prisma-pkg.json').version)") \
  && npm install --no-save "prisma@${PRISMA_V}" \
  && rm /tmp/prisma-pkg.json \
  && chown -R nextjs:nodejs node_modules/prisma node_modules/@prisma node_modules/.bin/prisma 2>/dev/null || true

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
