# Portfolio Infrastructure (Mature V2)

Welcome to the Portfolio Infrastructure repository. This project uses a GitOps-based approach to manage a highly automated and secure Kubernetes environment.

## 📖 Documentation
Choose your preferred language for the deployment guide:

- 🇬🇧 **[English - Full Deployment Guide (A-Z)](docs/README.md)**
- 🇻🇳 **[Tiếng Việt - Hướng dẫn Vận hành & Troubleshooting](docs/readme2.md)**
- 🇻🇳 **[Tiếng Việt - Hướng dẫn Backup & Restore với Velero](docs/velero-backup.md)**

## 🚀 Quick Start
1. **Bootstrap Infrastructure**: Use Ansible in `ansible/`.
2. **Enable GitOps**: Apply `argocd/root/app-of-apps.yaml`.
3. **Monitor Cluster**: Access Grafana via your configured domain.

---
*Managed by GitOps & ArgoCD*
