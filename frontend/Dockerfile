# ==============================================================================
# FRONTEND DOCKERFILE (Next.js)
# LAST UPDATED: 2026-10-24
# SECURITY PATCH: Pinned node:22.23.4-alpine to resolve:
#   - CVE-2026-111497 (Brotli Decoder Buffer Overflow - RCE/DoS)
#   - CVE-2026-105482 (DNS Resolution NUL Character Truncation)
#   - CVE-2026-105483 (TLS Hostname IP Verification Bypass)
#   - CVE-2026-109924 (Undici EventSource Memory Exhaustion DoS)
# ==============================================================================

# Stage 1: Builder
FROM node:22.23.4-alpine AS builder
RUN apk update && apk upgrade --no-cache && apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main libcrypto3 libssl3 libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Standalone build - only copy frontend files
COPY package.json pnpm-lock.yaml ./

# [OPTIMIZATION] Use Docker Cache Mount to cache pnpm store across builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts --store-dir /pnpm/store

# Copy source
COPY . .

# Build frontend
ARG INTERNAL_API_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# [SPECIAL OPTIMIZATION] Use Docker Cache Mount for .next/cache directory to persist SWC/Babel/Webpack cache
# Reduces Next.js build time significantly on subsequent builds!
RUN --mount=type=cache,target=/app/.next/cache \
    pnpm run build

# Stage 2: Runner
FROM node:22.23.4-alpine AS runner
RUN apk update && apk upgrade --no-cache && apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main libcrypto3 libssl3 libc6-compat
# Remove npm and npx to eliminate base image security vulnerabilities
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create secure system user and group (non-root)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Synchronize permissions using --chown for all copied resources from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
