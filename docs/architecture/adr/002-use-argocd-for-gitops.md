# ADR 002: Use ArgoCD for GitOps-based Continuous Delivery

*   **Context**: [CI/CD Pipeline & GitOps Flow](../../deployment/gitops-workflow.md)

---

## 1. Context and Problem Statement
To deploy applications to our Kubernetes cluster, we need a secure, automated, and audit-friendly Continuous Delivery (CD) workflow. The traditional method of running `kubectl apply` inside a GitLab CI runner requires storing highly sensitive cluster admin credentials (`kubeconfig`) as GitLab CI secret variables. This introduces a major security risk: if a runner is compromised, the entire cluster is compromised.

---

## 2. Decision Outcome
We decided to adopt a pull-based **GitOps** model using **ArgoCD** as the cluster GitOps controller.

### Consequences:
*   **Pull vs Push**: Instead of a CI runner pushing changes to the cluster, ArgoCD runs inside the cluster and pulls configuration changes from the Git repository.
*   **Security**: No cluster credentials (`kubeconfig`) are shared outside the cluster environment. The GitLab runner's access is restricted to editing values in the infrastructure repository.
*   **Reconciliation & Drift Detection**: ArgoCD continually matches the live state of the cluster against the target state defined in Git. Any manual changes (config drift) are automatically detected and rectified (auto-healed) back to the Git source-of-truth.
