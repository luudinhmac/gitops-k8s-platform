# ==============================================================================
# BACKEND DOCKERFILE (NestJS)
# LAST UPDATED: 2026-10-24
# SECURITY PATCH: Pinned node:22.23.4-alpine to resolve:
#   - CVE-2026-111497 (Brotli Decoder Buffer Overflow - RCE/DoS)
#   - CVE-2026-105482 (DNS Resolution NUL Character Truncation)
#   - CVE-2026-105483 (TLS Hostname IP Verification Bypass)
#   - CVE-2026-109924 (Undici EventSource Memory Exhaustion DoS)
# ==============================================================================

# ==========================================
# STAGE 1: Install all dependencies & build
# ==========================================
FROM node:22.23.4-alpine AS builder
RUN apk update && apk upgrade --no-cache && apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Copy dependency configuration files first
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# [OPTIMIZATION] Use Docker Cache Mount to cache pnpm store across builds (explicit store-dir)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# Generate Prisma Client BEFORE copying source code to optimize Docker layer caching
RUN npx prisma generate

# Copy all source code (must be done before inlining shared package code)
COPY . .

# [BUGFIX] Create and inline shared package code AFTER copying source to prevent overwriting with old local data
RUN mkdir -p src/_shared/contracts src/_shared/types && \
    cp -r shared/packages/contracts/src/* src/_shared/contracts/ && \
    cp -r shared/packages/types/src/* src/_shared/types/

# Build NestJS application (compiles to dist/ directory)
RUN rm -rf dist && pnpm run build


# ==========================================
# STAGE 2: Build production-only dependencies
# ==========================================
FROM node:22.23.4-alpine AS prod-deps
RUN apk update && apk upgrade --no-cache && apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Only copy files needed to install production node_modules
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# [OPTIMIZATION] Continue using pnpm cache mount here (explicit store-dir)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --store-dir /pnpm/store

# Generate production-ready Prisma Client (only outputs inside node_modules)
RUN npx prisma generate


# ==========================================
# STAGE 3: Final Runner stage
# ==========================================
FROM node:22.23.4-alpine AS runner
RUN apk update && apk upgrade --no-cache && apk add --no-cache openssl
# Remove npm and npx to eliminate base image security vulnerabilities
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
WORKDIR /app

ENV NODE_ENV=production

# Create secure system user and group (non-root)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    mkdir -p /app/uploads && \
    chown -R nestjs:nodejs /app

# Copy all resources from previous stages with proper ownership (nestjs user)
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=prod-deps --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=prod-deps --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs
EXPOSE 3001

CMD ["node", "dist/src/main.js"]
