# Stage 1: Build
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Standalone build within backend directory
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY shared ./shared

# Copy shared source code and inline it into src
RUN mkdir -p src/_shared/contracts src/_shared/types
RUN cp -r shared/packages/contracts/src/* src/_shared/contracts/
RUN cp -r shared/packages/types/src/* src/_shared/types/

# Install all dependencies (Prisma generate runs in postinstall)
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma Client for builder (types)
RUN npx prisma generate

# Build backend (Everything is now in src/)
WORKDIR /app
RUN rm -rf dist
RUN pnpm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

# Production setup
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --no-frozen-lockfile
RUN npx prisma generate

# Copy build artifacts
COPY --from=builder /app/dist ./dist

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    mkdir -p /app/uploads && \
    chown -R nestjs:nodejs /app

USER nestjs
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/src/main.js"]
