# Implementation Plan: Monorepo Decoupling to Multi-Repo

## Infrastructure Overview

- **Local Dev:** Windows (VS Code/Cursor), running Native Node.js/Next.js.
- **Ansible Node:** `192.168.157.50` (Ubuntu 24.04). Controls OS, K8s, and Docker setup.
- **K8s Staging:** `192.168.157.110` (Ubuntu 24.04). Local K8s for image verification.
- **K8s Production:** VPS (Ubuntu 24.04). Runs **GitLab Runner Agent 2** inside K8s.
- **Build Agent:** `192.168.157.109` (Ubuntu 24.04). Runs **GitLab Runner Agent 1** for Docker builds.
- **Registry:** GitLab.com Container Registry.

## CI/CD Flow (Tag-Triggered: `v*`)

1. **Build Phase (Agent 1 - Local VM):**
   - Triggered by Git Tag push (e.g., `v1.0.1`).
   - Multi-stage Docker build.
   - Push to GitLab Registry.
   - Immediate cleanup: `docker image prune -f`.
2. **Staging Phase (Local K8s):**
   - Auto-deploy to `192.168.157.110`.
   - Manual verification of "Superuser" and stability.
3. **Production Phase (VPS K8s):**
   - Manual Approval on GitLab.
   - **Agent 2 (Inside K8s)** executes `kubectl set image`.
   - VPS K8s pulls image via 443 (Zero Inbound requirement).

## Security Strategy (Zero Inbound)
- **VPS Security:** No 6443 port exposure. Agent 2 initiates outbound connection to GitLab.
- **Ports:** Only 80/443 open for public access.
- **SSH:** Only Ansible Node (`.50`) can SSH into other VMs/VPS.

## User Review Required

> [!IMPORTANT]
> The migration will break the current `pnpm-workspace` structure. Local development will require running two separate instances of VS Code or terminals.
> 
> We will use **Swagger/OpenAPI** as the bridge between repositories. This means the Frontend will no longer have access to the Backend's `.ts` files directly.

## Phase 1: Analysis
- Identify all shared packages in `/packages`.
- Map all imports of `@portfolio/types` and `@portfolio/contracts` in both services.
- Analyze current Docker build layers to understand workspace dependencies.

## Phase 2: Proposed Structure

### Backend Repo
- Root: contents of current `/backend`.
- Shared: `/packages` moved to `/shared`.
- API Spec: Automated export of `swagger.json`.

### Frontend Repo
- Root: contents of current `/frontend`.
- API Client: Generated from Backend's `swagger.json`.
- No local shared packages.

## Phase 3: Detailed Implementation Plan

### Milestone 1: Backend Isolation
- Move files to new structure.
- Update `package.json` dependencies from `workspace:*` to relative paths `./shared/...`.
- Implement a Swagger Export script (for CI/CD usage).
- Rewrite `Dockerfile` to be standalone.

### Milestone 2: Frontend Isolation
- Move files to new structure.
- Remove workspace configuration.
- Install `openapi-typescript`.
- Batch update all imports (refactoring `@portfolio/types` to `@/api/generated`).
- Rewrite `Dockerfile` for standalone Next.js build.

### Milestone 3: CI/CD & DevOps
- Create separate `.gitlab-ci.yml` files.
- Update K8s manifests for independent deployment.

## Verification Plan

### Automated Tests
- Run `pnpm build` in both isolated repositories.
- Run `pnpm test` (if available) to ensure logic remains intact.

### Manual Verification
- Verify the website works fully in a local "decoupled" state (Frontend running on port 3000, Backend on port 3001, communicating via API).
- Check that form validations (previously handled by shared contracts) still work via the new generated types.
