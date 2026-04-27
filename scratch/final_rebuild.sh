#!/bin/bash
cd /data/Portfolio

# 1. Dọn dẹp cực sạch
echo "== NUCLEAR CLEANING =="
docker system prune -f
docker rmi portfolio-backend:latest portfolio-frontend:latest 2>/dev/null
git clean -fdx -e .env -e database_structure_v2.sql

# 2. Sửa Dockerfile cho Backend (Workspace Aware + Contracts Build)
cat <<EOF > backend/Dockerfile
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy TOÀN BỘ repo để pnpm workspace hoạt động đúng
COPY . .

# Install dependencies cho toàn bộ workspace
RUN pnpm install --no-frozen-lockfile

# Build contracts TRƯỚC
WORKDIR /app/packages/contracts
RUN pnpm run build

# Build backend SAU
WORKDIR /app/backend
RUN ./node_modules/.bin/prisma generate
RUN pnpm run build

FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
# Cần copy cả contracts dist nếu backend runtime phụ thuộc vào nó (thường là có trong node_modules rồi)

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    mkdir -p /app/uploads && \
    chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]
EOF

# 3. Build & Import
echo "== BUILDING FRONTEND =="
docker build --no-cache -t portfolio-frontend:latest -f frontend/Dockerfile .
echo admin | sudo -S docker save portfolio-frontend:latest | sudo ctr -n k8s.io images import -

echo "== BUILDING BACKEND =="
docker build --no-cache -t portfolio-backend:latest -f backend/Dockerfile .
echo admin | sudo -S docker save portfolio-backend:latest | sudo ctr -n k8s.io images import -

# 4. Restart K8s
kubectl rollout restart deployment -n portfolio
kubectl scale deployment --all --replicas=1 -n portfolio
