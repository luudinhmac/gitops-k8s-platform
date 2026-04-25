# ☸️ KUBERNETES PRODUCTION DEPLOYMENT REPORT

**Project Name:** Portfolio Full-Stack
**Deployment Date:** 2026-04-24
**Status:** ✅ OPERATIONAL (Production-Grade)

---

## 1. 🏗️ SYSTEM ARCHITECTURE
*   **Platform:** Single-node Bare-metal Kubernetes (Ubuntu 24.04).
*   **Container Runtime:** `containerd` (K8s standard) + `Docker` (for local builds).
*   **Networking:** 
    *   **CNI:** Flannel (Pod network).
    *   **Ingress Gateway:** Nginx Pod using `hostNetwork: true` to bind directly to VPS ports 80/443.
    *   **Compatibility:** Fully compatible with Cloudflare Proxy (Standard 443 port).

---

## 2. 🔐 SECURITY & SECRET MANAGEMENT
*   **No Secrets in Git:** All passwords, keys, and DB URLs are injected via K8s `Secrets` and `ConfigMaps`.
*   **Auto-generated JWT:** Ansible automatically generates a strong 32-character random string for `JWT_SECRET` if not already present.
*   **Persistent Secrets:** Secrets are persisted in K8s, so redeploying doesn't logout users.
*   **Proxy Security:** Public access to `/api/docs` (Swagger) is strictly blocked in production.

---

## 3. 🛠️ TROUBLESHOOTING LOG (INCIDENTS FIXED)
| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **Image Not Found** | Containerd couldn't see Docker-built images. | Bridge via `docker save | ctr import`. |
| **400 Bad Request** | HTTP request sent to HTTPS port. | Added `error_page 497` for auto-redirect. |
| **DB Auth Failure** | User/DB name mismatch in manifests. | Synchronized credentials in Backend env vars. |
| **Avatar Load Error** | Incorrect API URL in Frontend. | Configured `NEXT_PUBLIC_API_URL` to point to the real VPS IP/Domain. |
| **Docker Service Failure** | Daemon stopped or conflicted. | Re-installed and ensured co-existence with containerd. |

---

## ⌨️ 4. ESSENTIAL COMMANDS REFERENCE

### 🚀 Ansible (From Controller)
```bash
# Full deployment
ansible-playbook -i inventory.ini playbooks/k8s_app_deploy.yml
```

### ☸️ Kubectl (Management)
```bash
# Check all resources
kubectl get all -n portfolio

# Check logs
kubectl logs -n portfolio deployment/backend
kubectl logs -n portfolio deployment/nginx

# Run migrations manually
kubectl exec -n portfolio deployment/backend -- npx prisma db push

# Get Dashboard Token
kubectl -n kubernetes-dashboard create token admin-user
```

---

## ✅ 5. FINAL VERIFICATION
*   **Standard HTTPS:** `https://192.168.157.110` -> Works.
*   **HTTP Redirect:** `http://192.168.157.110` -> Redirects to 443.
*   **K8s Dashboard:** `https://192.168.157.110:30444` -> Works.
*   **Database:** Connected and persistence verified.

ssh macld@192.168.157.50 "ssh -i ~/.ssh/id_ed25519_ansible macld@192.168.157.110 'kubectl -n kubernetes-dashboard create token admin-user'"