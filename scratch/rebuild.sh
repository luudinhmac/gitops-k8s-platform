#!/bin/bash
cd /data/Portfolio

# Build Frontend từ root context
docker build --no-cache -t portfolio-frontend:latest -f frontend/Dockerfile .
echo admin | sudo -S docker save portfolio-frontend:latest | sudo ctr -n k8s.io images import -

# Build Backend từ root context
docker build --no-cache -t portfolio-backend:latest -f backend/Dockerfile .
echo admin | sudo -S docker save portfolio-backend:latest | sudo ctr -n k8s.io images import -

kubectl rollout restart deployment -n portfolio
