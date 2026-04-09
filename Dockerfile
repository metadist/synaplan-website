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

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma schema + migrations (needed for migrate deploy at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
