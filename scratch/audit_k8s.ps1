$Server = "macld@192.168.157.110"
$Pass = "admin"

function Run-SSH {
    param([string]$cmd)
    ssh $Server $cmd
}

function Run-Sudo-SSH {
    param([string]$cmd)
    ssh $Server "echo $Pass | sudo -S $cmd"
}

Write-Host "=== 1. System Information ==="
Run-SSH "uname -a; cat /etc/os-release; hostnamectl; timedatectl; free -h; df -h; lsblk; uptime"

Write-Host "=== 2. Network & Open Ports Audit ==="
Run-SSH "ss -tulpn; curl -s ifconfig.me; echo"

Write-Host "=== 3. Firewall Audit ==="
Run-Sudo-SSH "ufw status verbose"
Run-Sudo-SSH "iptables -L -n -v"
Run-Sudo-SSH "iptables -t nat -L -n -v"
Run-Sudo-SSH "nft list ruleset"

Write-Host "=== 4. SSH Security Audit ==="
Run-SSH "cat /etc/ssh/sshd_config"
Run-Sudo-SSH "journalctl -u ssh --since '24 hours ago'"
Run-Sudo-SSH "fail2ban-client status"
Run-Sudo-SSH "fail2ban-client status sshd"

Write-Host "=== 5. Kubernetes Cluster Audit ==="
Run-SSH "kubectl cluster-info; kubectl get nodes -o wide; kubectl get ns"

Write-Host "=== 6. Kubernetes API Security ==="
Run-SSH "kubectl auth can-i '*' '*' --all-namespaces; ss -tulpn | grep 6443"

Write-Host "=== 7. RBAC Audit ==="
Run-SSH "kubectl get clusterrolebinding | grep cluster-admin; kubectl get sa -A"

Write-Host "=== 8. Secret Exposure Audit ==="
Run-Sudo-SSH "find / -name '.env' 2>/dev/null"
Run-Sudo-SSH "find / -name 'id_rsa' 2>/dev/null"
Run-Sudo-SSH "find / -name 'kubeconfig' 2>/dev/null"

Write-Host "=== 9. Ingress & Public Service Audit ==="
Run-SSH "kubectl get ingress -A; kubectl get svc -A"

Write-Host "=== 10. Traefik / Ingress Security ==="
Run-SSH "curl -s http://localhost:8080/dashboard/"
Run-SSH "kubectl get cm -A | grep traefik"

Write-Host "=== 11. Container Security Audit ==="
Run-SSH "kubectl get pods -A -o jsonpath='{..image}'; echo"
Run-SSH "kubectl get pod -A -o yaml"

Write-Host "=== 13. Resource & Stability Audit ==="
Run-SSH "kubectl get pods -A; kubectl get pods -A | grep -E 'CrashLoopBackOff|Error'; kubectl get events -A --sort-by=.lastTimestamp"

Write-Host "=== 14. Persistent Data Audit ==="
Run-SSH "kubectl get pvc -A"
Run-Sudo-SSH "du -sh /var/lib/containerd"
Run-Sudo-SSH "du -sh /var/lib/kubelet"

Write-Host "=== 15. Backup Verification ==="
Run-SSH "ETCDCTL_API=3 etcdctl snapshot status backup.db 2>/dev/null"
Run-Sudo-SSH "ls -lah /backup 2>/dev/null"

Write-Host "=== 16. TLS & HTTPS Audit ==="
Run-SSH "curl -Iv https://luumac.io.vn 2>&1"

Write-Host "=== 17. Monitoring & Logging Audit ==="
Run-Sudo-SSH "journalctl -p 3 -xb | tail -n 50"
Run-SSH "kubectl get pods -A | grep -E 'grafana|prometheus|loki'"

Write-Host "=== 18. CI/CD & GitOps Audit ==="
Run-SSH "kubectl get secret argocd-initial-admin-secret -n argocd 2>/dev/null; kubectl get applications -A 2>/dev/null"
