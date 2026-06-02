# Walkthrough: Decoupling Monorepo into Microservices

We have successfully separated the Portfolio project into two independent, production-ready modules.

## 1. Backend Architecture (Source of Truth)
The Backend now owns the API contracts.
- **Contracts:** Located in `backend/shared/packages/contracts`. All entities (`Post`, `User`, `Category`, etc.) are now `class` based with `@ApiProperty` decorators.
- **Swagger Export:** A new script `pnpm run swagger:export` generates a `swagger-spec.json` file.
- **Standalone Docker:** `backend/Dockerfile` is now self-contained.

## 2. Frontend Architecture (Decoupled)
The Frontend no longer depends on shared raw files.
- **Type Safety:** Uses `openapi-typescript` to sync types directly from the Backend's Swagger spec.
- **Type Bridge:** `frontend/src/types/index.ts` provides clean, developer-friendly aliases for all API entities.
- **Refactoring:** All `@portfolio/types` imports have been replaced with local `@/types`.
- **Standalone Docker:** `frontend/Dockerfile` is a standard Next.js standalone build.

## 3. Project Structure
```
Portfolio/
├── backend/                # Independent NestJS App
│   ├── shared/             # Internal shared contracts
│   ├── src/                # Core logic
│   └── Dockerfile          # Standalone build
└── frontend/               # Independent Next.js App
    ├── src/types/          # Generated API types
    └── Dockerfile          # Standalone build
```

## 4. Infrastructure & CI/CD Flow

The project follows a **Local Build - Remote Deploy** strategy with a **Zero Inbound** security model.

### Infrastructure Components
- **Agent 1 (192.168.157.109):** Local VM for building Docker images and deploying to Staging.
- **Agent 2 (VPS):** Runs inside Production K8s. Pulls images and updates deployments.
- **Ansible Node (192.168.157.50):** Control Plane for infrastructure management.
- **Registry:** GitLab Container Registry.

### The CI/CD Flow (Tag-Triggered: `v*`)
1. **Push Tag:** Developer pushes a tag (e.g., `git push origin v1.0.1`).
2. **Package (Agent 1):**
   - GitLab Runner on VM `.109` builds the Docker image.
   - Pushes to GitLab Registry.
   - Cleans up local images immediately (`docker image prune`).
3. **Staging (Agent 1):**
   - Automatically deploys to Local K8s Staging (`.110`).
   - Manual verification of stability.
4. **Production (Agent 2):**
   - Manual approval triggers the VPS deployment.
   - GitLab Runner inside VPS K8s executes `kubectl set image`.
   - VPS pulls the new image via 443 (Secure, no inbound ports required).

## 5. Security & Optimization
- **Zero Inbound:** No K8s API exposure on VPS. Agent 2 calls out to GitLab.
- **Resource Efficiency:** Build process is offloaded from VPS to Local VM.
- **Automated Cleanup:** Runners prune images after build; Ansible cronjobs handle deep cleaning at 3 AM.

## 6. Infrastructure Implementation Status

- **Common & Docker (Phase 1)**: ✅ Hoàn thành trên máy Build (.109) và K8s Staging (.110).
- **Kubernetes Cluster (Phase 2)**: ✅ v1.31.14 đã hoạt động ổn định trên node .110 (Single-node).
- **GitLab Runner (Phase 3)**: ✅ Agent 1 (Build VM) đã đăng ký thành công và đang Online.

## 6. Verification
- [x] Backend builds and exports Swagger spec.
- [x] Frontend successfully syncs types from Swagger (local and remote support).
- [x] Frontend code builds without any workspace dependencies.
- [x] Dockerfiles and GitLab CI configs are prepared for the 2-agent architecture.

---
**Next Steps:**
- Execute the physical repository split:
  1. Create `portfolio-backend` and `portfolio-frontend` on GitLab.
  2. Use `git filter-repo` to push subdirectories as new repo roots.
  3. Configure GitLab CI/CD Variables:
     - `K8S_STAGING_CONTEXT`: For Staging K8s access.
     - `BACKEND_SWAGGER_URL`: For Frontend type sync.
- Final cleanup of the monorepo root.
