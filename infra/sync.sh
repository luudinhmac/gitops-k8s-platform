#!/bin/bash
ssh -p 2222 -i ~/.ssh/id_ed25519_ansible macld@103.6.235.15 '
kubectl patch application platform-velero -n argocd --type=merge -p "{\"operation\":null}"
kubectl patch application platform-velero-configs -n argocd --type=merge -p "{\"operation\":null}"
kubectl patch application platform-velero -n argocd --type=merge -p "{\"operation\":{\"sync\":{}}}"
kubectl patch application platform-velero-configs -n argocd --type=merge -p "{\"operation\":{\"sync\":{}}}"
'

