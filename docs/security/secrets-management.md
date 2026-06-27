# 🔐 Secrets Management (Sealed Secrets)

Tài liệu này đặc tả quy trình quản lý thông tin nhạy cảm (Secrets) trong dự án tuân theo triết lý **GitOps**. Chúng tôi sử dụng giải pháp **Bitnami Sealed Secrets** để mã hóa các thông tin nhạy cảm trước khi đẩy lên Git.

---

## 1. Tại sao lại dùng Sealed Secrets?

Trong mô hình GitOps, mọi manifest khai báo tài nguyên (bao gồm Deployments, Services, ConfigMaps, Secrets) bắt buộc phải được lưu trữ trên Git để ArgoCD đồng bộ. 
*   **Vấn đề**: K8s Secret thông thường chỉ được mã hóa dạng **Base64** (rất dễ bị giải mã ngược). Nếu push trực tiếp file này lên Git công khai hoặc nội bộ, các thông tin nhạy cảm (như mật khẩu DB, API keys) sẽ bị lộ.
*   **Giải pháp**: **Sealed Secrets** giải quyết vấn đề này bằng phương pháp mã hóa bất đối xứng (asymmetric encryption). 
    *   Chỉ có Controller chạy bên trong cụm Kubernetes (sở hữu Private Key) mới có thể giải mã được file.
    *   File sau khi mã hóa được gọi là **SealedSecret**, hoàn toàn an toàn khi lưu trữ công khai trên Git.

---

## 2. Luồng hoạt động mã hóa & giải mã

```mermaid
graph TD
    subgraph Developer Laptop
        RawSecret[Raw Secret K8s YAML] -->|kubeseat CLI + Public Key| SealedSecretYAML[SealedSecret YAML]
    end
    
    SealedSecretYAML -->|git push| Git[Infrastructure Repository]
    Git -->|Pull Sync| ArgoCD[ArgoCD Operator]
    
    subgraph K8s Cluster
        ArgoCD -->|Apply| SealedSecretCustomResource[SealedSecret Custom Resource]
        SealedSecretController[Sealed Secrets Controller] -->|Read Private Key| Decrypt[Decrypt Engine]
        SealedSecretCustomResource --> Decrypt
        Decrypt -->|Generate| K8sSecret[Standard Kubernetes Secret]
    end
```

---

## 3. Quy trình làm việc thực tế cho Nhà phát triển

Khi cần thêm mới hoặc cập nhật một Secret (ví dụ: `DATABASE_URL` cho Backend):

### Bước 1: Tạo tệp Secret K8s thô (Local only)
Tạo file `secret-raw.yaml` cục bộ trên máy tính của bạn (đảm bảo file này được thêm vào `.gitignore` để không bị push lên Git):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: portfolio-backend-secrets
  namespace: production
type: Opaque
stringData:
  DATABASE_URL: "postgresql://portfolio_user:password@postgres-prod:5432/db"
  JWT_SECRET: "my-jwt-secret"
```

### Bước 2: Tiến hành mã hóa (Seal) bằng công cụ `kubeseal`
Chạy lệnh sau để mã hóa file thô thành SealedSecret sử dụng chứng chỉ công khai (Public Key) lấy từ cụm:
```bash
kubeseal --controller-name=sealed-secrets-controller \
         --controller-namespace=kube-system \
         --format yaml < secret-raw.yaml > secret-sealed.yaml
```

### Bước 3: Lưu trữ và Triển khai
*   Đẩy file `secret-sealed.yaml` lên kho lưu trữ `portfolio-infrastructure`.
*   ArgoCD sẽ nhận diện file, đồng bộ lên cụm. Sealed Secrets Controller trong cụm tự động giải mã ngược lại thành tệp Secret K8s thông thường cho ứng dụng sử dụng.

---

## 4. Sao lưu và Khôi phục Khóa giải mã (Secret Keys Backup)

> [!IMPORTANT]
> **Khóa giải mã là tài sản tối mật**:
> Nếu mất Private Key của Sealed Secrets Controller chạy trong cụm, toàn bộ các file `SealedSecret` trên Git sẽ **vĩnh viễn không thể giải mã được nữa** và bạn phải tự tay mã hóa lại tất cả từ đầu.

*   **Sao lưu khóa**:
    ```bash
    kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > sealed-secrets-private-keys.yaml
    ```
    *Cất giữ file `sealed-secrets-private-keys.yaml` này ở nơi tuyệt đối an toàn và ngoại tuyến.*
