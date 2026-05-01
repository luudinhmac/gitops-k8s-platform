#!/bin/bash
export KUBECONFIG=/home/macld/.kube/config
BACKEND_POD=$(kubectl get pods -n portfolio -l app=portfolio-backend -o jsonpath='{.items[0].metadata.name}')
echo "Seeding on pod: $BACKEND_POD"
kubectl exec -n portfolio $BACKEND_POD -- node scripts/seed.js
