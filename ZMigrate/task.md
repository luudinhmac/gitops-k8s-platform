# Project Migration Progress

## Phase 1: Backend Decoupling [x]
- [x] 1.1. Restructure Backend directory [x]
- [x] 1.2. Decouple `contracts` and `types` packages to `backend/shared` [x]
- [x] 1.3. Strengthen Swagger metadata in DTOs/Entities [x]
- [x] 1.4. Implement `swagger:export` script [x]
- [x] 1.5. Verify Backend build & Swagger output [x]

## Phase 2: Frontend Refactoring [x]
- [x] 2.1. Remove workspace dependencies [x]
- [x] 2.2. Configure `openapi-typescript` sync [x]
- [x] 2.3. Create `frontend/src/types/index.ts` bridge [x]
- [x] 2.4. Refactor ALL module imports (Posts, Users, Auth, etc.) [x]
- [x] 2.5. Verify frontend type safety [x]

## Phase 3: Dockerization & Infrastructure [x]
- [x] 3.1. Create standalone `frontend/Dockerfile` [x]
- [x] 3.2. Update/Verify `backend/Dockerfile` [x]
- [x] 3.3. Split Kubernetes manifests (Already separated in `k8s/`) [x]
- [x] 3.4. Final verification of independent builds [x]

## Phase 4: CI/CD Pipeline [x]
- [x] 4.1. Configure GitLab CI for Backend [x]
- [x] 4.2. Configure GitLab CI for Frontend (Independent Sync) [x]

## Phase 5: Repository Split & Cleanup [ ]
- [ ] 5.1. Create separate GitLab repositories
- [x] 5.2. Push `backend/` contents as root of `portfolio-backend` [x]
- [x] 5.3. Push `frontend/` contents as root of `portfolio-frontend` [x]
- [ ] 5.4. Verify CI/CD in new repositories
- [ ] 5.5. Remove monorepo root files (Cleanup)
