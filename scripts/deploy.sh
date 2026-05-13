#!/bin/bash

# Deployment script using Kustomize
# Usage: ./deploy.sh [staging|production]

ENV=${1:-staging}
K8S_DIR="$(dirname "$0")/../infra/k8s"
if [ ! -d "$K8S_DIR" ]; then
    K8S_DIR="$(dirname "$0")/../k8s"
fi

if [ ! -d "$K8S_DIR/overlays/$ENV" ]; then
    echo "Error: Environment $ENV not found in $K8S_DIR/overlays/"
    exit 1
fi

echo "Deploying to $ENV..."
kubectl apply -k "$K8S_DIR/overlays/$ENV"

echo "Deployment finished."
