# Stage 1: Builder
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Standalone build - only copy frontend files
COPY package.json pnpm-lock.yaml ./

# [TỐI ƯU] Sử dụng Docker Cache Mount để cache lại pnpm store giữa các lần build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts --store-dir /pnpm/store

# Copy source
COPY . .

# Build frontend
ARG INTERNAL_API_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# [TỐI ƯU ĐẶC BIỆT] Sử dụng Docker Cache Mount cho thư mục .next/cache để lưu lại SWC/Babel/Webpack cache
# Giúp giảm thời gian biên dịch (build time) của Next.js từ các lần chạy sau xuống mức tối đa!
RUN --mount=type=cache,target=/app/.next/cache \
    pnpm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
RUN apk update && apk upgrade --no-cache && apk add --no-cache libc6-compat
# Remove npm and npx to eliminate base image security vulnerabilities
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Tạo nhóm và user hệ thống bảo mật (non-root)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Sử dụng --chown đồng bộ cho toàn bộ tài nguyên mang sang từ builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
