# Implementation Plan: Infrastructure Setup (Ansible & K8s)

Tài liệu này chi tiết kế hoạch triển khai hạ tầng từ Ansible Node tới các máy trạm (Build VM, K8s Staging, K8s Production).

## Infrastructure Overview

- **Ansible Node (.50):** Control Plane.
- **Build Agent (.109):** Chuyên build Docker Image (Agent 1).
- **K8s Staging (.110):** Môi trường test nội bộ (Kubeadm).
- **K8s Production (VPS):** Môi trường chạy thực tế (Agent 2 inside K8s).

---

## Phase 1: Chuẩn bị hệ thống & Docker (Tất cả Node)
**Mục tiêu:** Đảm bảo hệ điều hành sạch sẽ và sẵn sàng chạy container.

- [ ] **1.1. Role Common:**
    - Cập nhật Apt cache, nâng cấp hệ thống (Ubuntu 24.04).
    - Cài đặt các gói cơ bản: `curl`, `git`, `vim`, `unzip`, `gnupg`.
    - Đồng bộ SSH key từ Ansible Node tới các máy trạm.
- [ ] **1.2. Role Docker:**
    - Cài đặt Docker Engine & Containerd.io.
    - Cấu hình quyền truy cập docker cho user `macld`.
    - Riêng Build Agent: Cấu hình dọn dẹp image sau build (`docker image prune`).

## Phase 2: Triển khai Kubernetes (Staging & Prod)
**Mục tiêu:** Thiết lập cụm K8s sử dụng `kubeadm` theo chuẩn production.

- [ ] **2.1. Cài đặt thành phần K8s:**
    - Cài đặt `kubelet`, `kubeadm`, `kubectl` và giữ phiên bản (hold).
- [ ] **2.2. Khởi tạo Cluster (Master Node):**
    - Chạy `kubeadm init` với dải mạng Pod Flannel (`10.244.0.0/16`).
    - Cấu hình `.kube/config` cho user `macld`.
- [ ] **2.3. Cài đặt CNI & Tweak:**
    - Cài đặt **Flannel CNI** để thông mạng giữa các Pod.
    - Gỡ bỏ Taint master (allow-scheduling) để chạy được ứng dụng trên đơn node.

## Phase 3: Triển khai GitLab Runner (Agent 1 & 2)
**Mục tiêu:** Thiết lập hệ thống tự động hóa build và deploy.

- [ ] **3.1. Agent 1 (Build VM .109):**
    - Cài đặt GitLab Runner dưới dạng service trên Linux.
    - Đăng ký (Register) với GitLab.com sử dụng executor `docker`.
    - Cấp quyền cho Runner truy cập Docker socket.
- [ ] **3.2. Agent 2 (Production K8s):**
    - Cài đặt **Helm 3** trên node K8s.
    - Deploy GitLab Runner bằng **Helm Chart** vào namespace `gitlab-runner`.
    - Cấu hình RBAC để Runner có quyền `kubectl set image`.

## Phase 4: Triển khai Dịch vụ Hạ tầng (Staging)
**Mục tiêu:** Chạy Database và các tài nguyên hỗ trợ cho ứng dụng.

- [ ] **4.1. Storage & Namespace:**
    - Tạo namespace `portfolio`.
    - Cấu hình Persistent Volumes (PV) và Claims (PVC) cho Postgres và Uploads.
- [ ] **4.2. Database (Postgres):**
    - Deploy Postgres 16 (StatefulSet/Deployment).
    - Tạo Secret chứa `DATABASE_URL` và `JWT_SECRET` một cách an toàn.
- [ ] **4.3. Ingress & Nginx:**
    - Deploy Nginx Ingress Controller (hoặc NodePort theo cấu hình hiện tại).
    - Tạo SSL tự ký cho môi trường Staging.

## Phase 5: Kiểm tra & Bàn giao
- [ ] **5.1. Health Check:** Kiểm tra trạng thái các Pod (Postgres, Backend, Frontend).
* [ ] **5.2. CI/CD Test:** Chạy thử Pipeline bằng cách đẩy Tag `v1.0.0`.

---

## User Review Required

> [!IMPORTANT]
> **Token Đăng ký GitLab Runner**: Bạn cần cung cấp Runner Registration Token từ GitLab (Settings -> CI/CD -> Runners) để tôi điền vào biến `GITLAB_RUNNER_TOKEN_PROD`.

> [!WARNING]
> **Dọn dẹp Redis**: Chúng tôi đã loại bỏ Redis hoàn toàn khỏi kế hoạch triển khai để tránh lỗi tương thích với NestJS 11.

---
## Câu hỏi cho người dùng:
1. Bạn đã có sẵn GitLab Runner Token chưa?
2. Bạn muốn tôi tiến hành thực thi Phase 1 & 2 (Cài Docker & K8s) ngay bây giờ không?
