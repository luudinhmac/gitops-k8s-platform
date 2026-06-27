# 📝 Architecture Decision Records (ADR)

Tài liệu này ghi lại các quyết định thiết kế hệ thống quan trọng của dự án. Mỗi quyết định được trình bày dưới dạng chuẩn ADR (Architecture Decision Record) để làm tài liệu đối chiếu cho tương lai.

## Danh Sách Quyết Định (ADR List)

1.  **[ADR 001: Selection of NestJS for Backend API Development](001-use-nestjs.md)**
    *   Lý do lựa chọn NestJS thay vì Express.js/Fastify làm framework cho Backend.
2.  **[ADR 002: Use ArgoCD for GitOps-based Continuous Delivery](002-use-argocd-for-gitops.md)**
    *   Phân tích mô hình Pull-based GitOps của ArgoCD giúp nâng cao tính bảo mật.
3.  **[ADR 003: Clean Architecture Domain Isolation Refactoring](003-clean-architecture-refactor.md)**
    *   Tái cấu trúc mô-đun Posts để tách biệt logic nghiệp vụ khỏi database schema và Prisma ORM.
