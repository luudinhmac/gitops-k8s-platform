# Stage 1: Build
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy root files for workspace awareness
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY backend ./backend

# Cache busting point
ARG CACHEBUST=1

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Build workspace packages
RUN pnpm --filter "@portfolio/*" build

# Build backend
WORKDIR /app/backend
RUN rm -rf dist
RUN npx prisma generate
RUN pnpm run build
RUN npx tsc prisma/seed.ts --outDir seed-bin --esModuleInterop --target es2023 --module commonjs --skipLibCheck
RUN ls -R seed-bin

# Stage 2: Runner
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

# Install ONLY production dependencies in the runner stage
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY --from=builder /app/packages ./packages
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --no-frozen-lockfile --filter backend...

# Copy build artifacts
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/seed-bin ./backend/seed-bin

# Cleanup node_modules to be even smaller (optional but recommended)
# We keep the filter result

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    mkdir -p /app/backend/uploads && \
    chown -R nestjs:nodejs /app
USER nestjs
WORKDIR /app/backend
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
