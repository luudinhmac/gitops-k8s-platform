#!/bin/bash
SERVER="macld@192.168.157.110"

echo "=== 1. System Information ==="
ssh $SERVER "uname -a; cat /etc/os-release; hostnamectl; timedatectl; free -h; df -h; lsblk; uptime"

echo "=== 2. Network & Open Ports Audit ==="
ssh $SERVER "ss -tulpn; curl -s ifconfig.me; echo"

echo "=== 3. Firewall Audit ==="
ssh $SERVER "sudo ufw status verbose; sudo iptables -L -n -v; sudo iptables -t nat -L -n -v; sudo nft list ruleset"

echo "=== 4. SSH Security Audit ==="
ssh $SERVER "cat /etc/ssh/sshd_config; sudo journalctl -u ssh --since '24 hours ago'; sudo fail2ban-client status; sudo fail2ban-client status sshd"

echo "=== 5. Kubernetes Cluster Audit ==="
ssh $SERVER "kubectl cluster-info; kubectl get nodes -o wide; kubectl get ns"

echo "=== 6. Kubernetes API Security ==="
ssh $SERVER "kubectl auth can-i '*' '*' --all-namespaces; ss -tulpn | grep 6443"

echo "=== 7. RBAC Audit ==="
ssh $SERVER "kubectl get clusterrolebinding | grep cluster-admin; kubectl get sa -A"

echo "=== 8. Secret Exposure Audit ==="
ssh $SERVER "sudo find / -name '.env' 2>/dev/null; sudo find / -name 'id_rsa' 2>/dev/null; sudo find / -name 'kubeconfig' 2>/dev/null"

echo "=== 9. Ingress & Public Service Audit ==="
ssh $SERVER "kubectl get ingress -A; kubectl get svc -A"

echo "=== 10. Traefik / Ingress Security ==="
ssh $SERVER "curl -s http://localhost:8080/dashboard/; kubectl get cm -A | grep traefik"

echo "=== 11. Container Security Audit ==="
ssh $SERVER "kubectl get pods -A -o jsonpath='{..image}'; echo; kubectl get pod -A -o yaml"

echo "=== 13. Resource & Stability Audit ==="
ssh $SERVER "kubectl get pods -A; kubectl get pods -A | grep -E 'CrashLoopBackOff|Error'; kubectl get events -A --sort-by=.lastTimestamp"

echo "=== 14. Persistent Data Audit ==="
ssh $SERVER "kubectl get pvc -A; sudo du -sh /var/lib/containerd; sudo du -sh /var/lib/kubelet"

echo "=== 15. Backup Verification ==="
ssh $SERVER "ETCDCTL_API=3 etcdctl snapshot status backup.db 2>/dev/null; ls -lah /backup 2>/dev/null"

echo "=== 16. TLS & HTTPS Audit ==="
ssh $SERVER "curl -Iv https://luumac.io.vn 2>&1 | head -n 20"

echo "=== 17. Monitoring & Logging Audit ==="
ssh $SERVER "sudo journalctl -p 3 -xb | tail -n 50; kubectl get pods -A | grep -E 'grafana|prometheus|loki'"

echo "=== 18. CI/CD & GitOps Audit ==="
ssh $SERVER "kubectl get secret argocd-initial-admin-secret -n argocd 2>/dev/null; kubectl get applications -A 2>/dev/null"
