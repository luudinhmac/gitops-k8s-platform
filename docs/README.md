# 📖 Documentation Index Directory

Chào mừng bạn đến với kho lưu trữ tài liệu kỹ thuật của dự án **Portfolio & Blog**. Thư mục này chứa toàn bộ tài liệu từ tổng quan dự án, kiến trúc hệ thống, hướng dẫn onboarding, tiêu chuẩn triển khai, runbooks vận hành cho đến nhật ký sự cố.

---

## 📂 Danh Mục Tài Liệu (Documentation Tree)

```text
docs/
├── overview/
│   ├── project_mission.md        # Mục tiêu dự án & Cơ chế Governance
│   └── coding_guidelines.md      # Quy chuẩn code "Smart Server, Lean Client"
├── architecture/
│   └── system_architecture.md    # Thiết kế mạng, namespaces & lưu trữ K8s
├── adr/
│   └── 0001-clean-architecture-refactor.md # Quyết định kiến trúc cơ sở dữ liệu (ADR)
├── onboarding/
│   ├── local_development.md      # Hướng dẫn setup dev, SSH tunnel & ENV
│   └── cv/
│       ├── cv_english.md         # English Curriculum Vitae
│       └── cv_vietnamese.md      # Vietnamese Curriculum Vitae
├── deployment/
│   ├── deployment_standards.md   # Tiêu chuẩn Docker, non-root, và namespaces
│   ├── ci_cd_gitops.md           # Chi tiết GitLab CI/CD & ArgoCD flow
│   └── k8s_setup_guide.md        # Cài đặt cụm K8s vật lý qua Ansible & Sealed Secrets
├── runbooks/
│   ├── backup_restore.md         # Hướng dẫn Velero, etcd & Postgres dump/restore
│   └── disaster_recovery.md      # Hướng dẫn khắc phục sự cố khẩn cấp (rebuild VPS, IP block)
├── troubleshooting/
│   ├── debug_journal.md          # Lỗi NestJS/Next.js/React hooks cục bộ
│   └── k8s_incidents.md          # Sự cố hạ tầng K8s thực tế (CPU spike, stand-alone proxy)
├── legal/
│   └── privacy_policy.md         # Chính sách bảo mật & quyền riêng tư (GDPR)
└── archive/                      # Nơi lưu trữ tài liệu lịch sử
    ├── security_report_2026.md
    ├── infra_report_staging_2026.md
    ├── detailed_infra_analysis_2026.md
    ├── infra_implementation_plan_2026.md
    ├── deployment_report_v2_2026.md
    ├── legacy_technical_docs_2026.md
    └── ZMigrate/                 # Thư mục di trú cũ
```

---

## ✍️ Hướng Dẫn Cập Nhật & Bảo Trì Tài Liệu (Documentation Maintenance)

Để đảm bảo hệ thống tài liệu luôn chính xác và cập nhật song song với mã nguồn (Documentation-as-Code):
1. **Quy tắc cập nhật:** Khi thay đổi logic hoặc hạ tầng (ví dụ: thêm Secret mới, đổi tên Service, nâng cấp thư viện core), nhà phát triển **bắt buộc** phải cập nhật các tài liệu liên quan trong cùng Merge Request.
2. **Review chéo:** Tài liệu sửa đổi sẽ được kiểm tra và phê duyệt bởi Kỹ sư trưởng hoặc Quản trị viên hệ thống trước khi gộp vào nhánh chính.
3. **Phân quyền sở hữu:** Tham khảo chi tiết tại **[Project Governance Matrix](file:///d:/DATA/Portfolio/docs/overview/project_mission.md#3-documentation-lifecycle-governance)** để biết Kỹ sư nào chịu trách nhiệm quản lý cấu phần tài liệu nào.
