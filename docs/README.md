# 📖 Technical Documentation Portal Index

Chào mừng bạn đến với cổng thông tin tài liệu kỹ thuật của dự án **Production-Grade GitOps Platform**. Thư mục này lưu trữ toàn bộ cẩm nang vận hành, quyết định kiến trúc và tiêu chuẩn phát triển dự án.

---

## 📂 Danh Mục Tài Liệu (Documentation Tree)

```text
docs/
├── README.md                         # Mục lục tổng quan
├── overview/
│   ├── project_mission.md            # Sứ mệnh & Cơ chế quản trị (Governance)
│   └── coding_guidelines.md          # Quy chuẩn coding "Smart Server, Lean Client"
├── architecture/
│   ├── system-architecture.md        # Thiết kế mạng, namespace và lưu trữ
│   └── adr/                          # Quyết định kiến trúc (ADR)
│       ├── README.md                 # Mục lục quyết định kiến trúc
│       ├── 001-use-nestjs.md         # Chọn NestJS làm API backend
│       ├── 002-use-argocd-for-gitops.md # Chọn ArgoCD làm GitOps controller
│       └── 003-clean-architecture-refactor.md # Tái cấu trúc Domain Isolation
├── deployment/
│   ├── gitops-workflow.md            # Sơ đồ pipeline GitLab CI/CD & ArgoCD flow
│   ├── zero-downtime-strategy.md     # Chiến lược RollingUpdate, liveness/readiness
│   └── staging-vs-production.md      # Chính sách khác biệt cấu hình Staging vs Prod
├── operations/
│   ├── disaster-recovery.md          # Chiến lược Velero, snapshot etcd lên Cloudflare R2
│   ├── runbook-common-issues.md      # Khắc phục lỗi kẹt DB migration, đổi IP Admin whitelist
│   └── monitoring-dashboards.md      # Hướng dẫn Prometheus & Grafana dashboard metrics
├── security/
│   ├── cloudflare-zero-trust.md      # Bảo vệ trang admin qua Cloudflare Access & OTP
│   ├── secrets-management.md         # Mã hóa dữ liệu nhạy cảm qua Sealed Secrets
│   ├── network-policies.md           # Cô lập luồng mạng giữa các namespaces trong K8s
│   └── security-patching.md          # Quy trình quét và vá lỗ hổng dependency bằng Trivy
├── testing/
│   ├── smoke-test-strategy.md        # Script smoke test và cơ chế dọn dẹp DB Staging
│   └── performance-testing.md        # Kiểm thử hiệu năng hệ thống bằng k6
└── onboarding/
    ├── local-development.md          # Hướng dẫn setup chạy dự án local, database & redis
    └── contributing-guide.md         # Quy tắc Git workflow, commit chuẩn hóa
```

---

## ✍️ Hướng Dẫn Cập Nhật & Bảo Trì Tài Liệu (Documentation Maintenance)

Để đảm bảo hệ thống tài liệu luôn chính xác và cập nhật song song với mã nguồn (Documentation-as-Code):
1. **Quy tắc cập nhật**: Khi thay đổi logic hoặc hạ tầng (ví dụ: thêm Secret mới, đổi tên Service, nâng cấp thư viện core), nhà phát triển **bắt buộc** phải cập nhật các tài liệu liên quan trong cùng Merge Request.
2. **Review chéo**: Tài liệu sửa đổi sẽ được kiểm tra và phê duyệt bởi Kỹ sư trưởng hoặc Quản trị viên hệ thống trước khi gộp vào nhánh chính.
3. **Phân quyền sở hữu**: Tham khảo chi tiết tại **[Project Governance Matrix](overview/project_mission.md#3-documentation-lifecycle-governance)** để biết Kỹ sư nào chịu trách nhiệm quản lý cấu phần tài liệu nào.
