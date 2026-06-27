# ADR 001: Selection of NestJS for Backend API Development

*   **Context**: [Coding Guidelines](../overview/coding_guidelines.md)

---

## 1. Context and Problem Statement
The project requires a robust, scalable, and maintainable backend API framework to handle portfolio content, authentication, category trees, and upload management. The key requirements are:
*   High developer productivity with structured architecture guidelines.
*   Strong support for TypeScript, Dependency Injection, and modern ORMs (specifically Prisma).
*   Built-in tools for validation, security guards, and auto-generated API documentation (Swagger).

We evaluated NestJS against alternatives like Express.js (too unopinionated, leading to configuration drift) and Fastify (lacking high-level architectural patterns out of the box).

---

## 2. Decision Outcome
We chose **NestJS** as the primary backend framework.

### Consequences:
*   **Architecture**: NestJS enforces an opinionated controller-service-module architecture, making codebase scaling predictable and aligning with the "Smart Server, Lean Client" pattern.
*   **TypeScript**: Built-in TypeScript support reduces typing boilerplate.
*   **Ecosystem**: NestJS integrates natively with Prisma (for PostgreSQL ORM) and Passport (for JWT authentication).
*   **Validation**: Uses `class-validator` and `class-transformer` pipes to securely sanitize inputs at the controller boundaries.
