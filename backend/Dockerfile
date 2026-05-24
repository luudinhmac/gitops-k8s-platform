# ==========================================
# STAGE 1: Install all dependencies & build
# ==========================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Copy các file cấu hình dependencies trước
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# [TỐI ƯU] Sử dụng Docker Cache Mount để cache lại pnpm store giữa các lần build (Có chỉ định rõ --store-dir)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# Sinh Prisma Client TRƯỚC KHI copy code để tối ưu hóa Docker Layer Caching
RUN npx prisma generate

# Copy toàn bộ mã nguồn vào (Phải làm trước khi inline shared code)
COPY . .

# [SỬA LỖI] Tạo và inline shared code SAU KHI COPY . . để tránh bị đè dữ liệu cũ từ máy local
RUN mkdir -p src/_shared/contracts src/_shared/types && \
    cp -r shared/packages/contracts/src/* src/_shared/contracts/ && \
    cp -r shared/packages/types/src/* src/_shared/types/

# Build ứng dụng NestJS (kết quả xuất ra thư mục dist/)
RUN rm -rf dist && pnpm run build


# ==========================================
# STAGE 2: Build production-only dependencies
# ==========================================
FROM node:22-alpine AS prod-deps
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Stage này chỉ cần các file config để cài đặt node_modules cho prod
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# [TỐI ƯU] Tiếp tục dùng cache mount cho pnpm tại đây (Có chỉ định rõ --store-dir)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --store-dir /pnpm/store

# Sinh Prisma Client bản production (chỉ chứa các file sinh ra trong node_modules)
RUN npx prisma generate


# ==========================================
# STAGE 3: Final Runner stage
# ==========================================
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
# Remove npm and npx to eliminate base image security vulnerabilities
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
WORKDIR /app

ENV NODE_ENV=production

# Tạo nhóm và user hệ thống bảo mật (non-root)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    mkdir -p /app/uploads && \
    chown -R nestjs:nodejs /app/uploads

# Copy toàn bộ tài nguyên từ các stage trước sang với quyền user nestjs
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=prod-deps --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=prod-deps --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs
EXPOSE 3001

CMD ["node", "dist/src/main.js"]
