# 🔴 PHASE 0 — BASELINE ANALYSIS: POSTS MODULE

## 1. Violations Detected

### ❌ Prisma Leakage in Service Layer
- `PostsService.findAll` (lines 81-152) constructs raw Prisma `where`, `select`, and `orderBy` objects.
- Use of Prisma-specific query logic like `{ contains: query, mode: 'insensitive' }` inside the service.
- Literal Prisma relation selections (`Category: { select: { ... } }`) defined in business logic.

### ❌ Repository Pattern Violation (Pass-through)
- `PostsRepository` (lines 8-34) is a shallow wrapper. It provides no abstraction; it simply exposes raw Prisma methods (`findMany`, `count`, etc.) to the service.
- It accepts a generic `Record<string, any>` which forces the service to "speak" Prisma.

### ❌ DTO Duplication
- `backend/src/modules/posts/dto/create-post.dto.ts` is a near-duplicate of `packages/contracts/src/posts.ts`.
- The backend currently ignores the shared contracts for its core data transfer objects.

### ❌ Dependency Flow Issues
- `PostsService` is directly coupled to the database schema. A change in the Prisma schema (e.g., renaming a relation) requires a rewrite of the service layer.

## 2. Files Affected
- [MODIFY] [posts.service.ts](file:///d:/DATA/Portfolio/backend/src/modules/posts/posts.service.ts)
- [MODIFY] [posts.repository.ts](file:///d:/DATA/Portfolio/backend/src/modules/posts/posts.repository.ts)
- [DELETE] [create-post.dto.ts](file:///d:/DATA/Portfolio/backend/src/modules/posts/dto/create-post.dto.ts)

---

# 🔴 PHASE 1 — DOMAIN ISOLATION

## 1. Domain Entities & Types
Created internal domain definitions that are independent of the ORM and the framework.

- [NEW] [post.entity.ts](file:///d:/DATA/Portfolio/backend/src/modules/posts/domain/post.entity.ts)
- [NEW] [post.types.ts](file:///d:/DATA/Portfolio/backend/src/modules/posts/domain/post.types.ts)
