# ADR 003: Clean Architecture Domain Isolation Refactoring

*   **Context**: [Coding Guidelines](../../overview/coding_guidelines.md)

---

## 1. Context and Problem Statement
During a security and quality audit of the NestJS backend, we identified architectural violations in the `PostsModule`:
1.  **Prisma Leakage in Service Layer**: `PostsService` directly constructed raw Prisma query objects (`where`, `select`, `orderBy`) and search filters (`{ contains: query, mode: 'insensitive' }`).
2.  **Repository Pattern Violation**: `PostsRepository` acted as a thin pass-through wrapper for Prisma Client without providing abstraction boundaries.
3.  **DTO Duplication**: The create post DTO was duplicated instead of sharing contracts.
4.  **Coupled Dependency Flow**: Business logic depended directly on the database schema.

---

## 2. Decision Outcome
We performed a refactoring to enforce domain isolation in accordance with Clean Architecture:
1.  **Entity Isolation**: Created `post.entity.ts` and `post.types.ts` to separate business domain data from database models.
2.  **Repository Abstraction**: Repositories translate Prisma models to domain entities. The Service layer communicates only via clean domain entities.
3.  **Contract Synchronization**: Removed duplicate DTOs and used shared contract DTOs.

### Consequences:
*   **Decoupled Logic**: Service logic is ORM-agnostic, making ORM changes easier.
*   **Schema Safety**: Database schema modifications are limited to the repository mapper layer.
*   **Boilerplate**: Slightly increases file counts (Entities, Mappers, Interfaces).
