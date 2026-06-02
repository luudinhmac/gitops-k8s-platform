# Infrastructure Setup Tasks

## Phase 1: Chuẩn bị hệ thống & Docker [x]
- [x] 1.1. Chạy Role Common cho tất cả node (build, staging_k8s) [x]
- [x] 1.2. Chạy Role Docker cho tất cả node [x]

## Phase 2: Triển khai Kubernetes (kubeadm) [x]
- [x] 2.1. Cài đặt kubelet, kubeadm, kubectl (Version: v1.31.14) [x]
- [x] 2.2. Khởi tạo K8s Cluster trên Staging (.110) (Status: Ready) [x]
- [x] 2.3. Cài đặt Flannel CNI & Gỡ Taint master [x]

## Phase 3: Triển khai GitLab Runner [ ]
- [x] 3.1. Cài đặt Agent 1 trên Build VM (.109) (Status: Online, Executor: Docker) [x]
- [ ] 3.2. Cài đặt Helm & Agent 2 trên Production K8s

## Phase 4: Triển khai Dịch vụ Hạ tầng (Staging) [x]
- [x] 4.1. Tạo Namespace & Storage (PV/PVC) (Status: Bound) [x]
- [x] 4.2. Triển khai Postgres 16 (Status: Running) [x]
- [x] 4.3. Cấu hình Secrets & Ingress (Status: Ready) [x]

## Phase 5: Kiểm tra [x]
- [x] 5.1. Health check dịch vụ (Status: Healthy)
- [x] 5.2. Chạy thử Pipeline đầu cuối (Status: Success - v1.1.8)
