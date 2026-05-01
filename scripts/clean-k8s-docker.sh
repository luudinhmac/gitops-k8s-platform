#!/bin/bash
set -e

echo "===== STOP SERVICES ====="
systemctl stop kubelet 2>/dev/null || true
systemctl stop docker 2>/dev/null || true
systemctl stop containerd 2>/dev/null || true

echo "===== DISABLE SERVICES ====="
systemctl disable kubelet 2>/dev/null || true
systemctl disable docker 2>/dev/null || true
systemctl disable containerd 2>/dev/null || true

echo "===== RESET KUBEADM ====="
kubeadm reset -f 2>/dev/null || true

echo "===== REMOVE K8S FILES ====="
rm -rf /etc/kubernetes/
rm -rf /var/lib/kubelet/
rm -rf /var/lib/etcd/
rm -rf /etc/cni/
rm -rf /opt/cni/
rm -rf ~/.kube

echo "===== REMOVE DOCKER / CONTAINERD DATA ====="
rm -rf /var/lib/docker/
rm -rf /var/lib/containerd/

echo "===== REMOVE NETWORK INTERFACES ====="
ip link delete cni0 2>/dev/null || true
ip link delete flannel.1 2>/dev/null || true
ip link delete docker0 2>/dev/null || true

echo "===== CLEAN IPTABLES ====="
iptables -F || true
iptables -t nat -F || true
iptables -t mangle -F || true
iptables -X || true

echo "===== REMOVE PACKAGES ====="
apt-mark unhold kubeadm kubelet kubectl 2>/dev/null || true

apt-get purge -y kubeadm kubectl kubelet kubernetes-cni 
docker.io docker-ce docker-ce-cli containerd 2>/dev/null || true

apt-get autoremove -y
apt-get autoclean

echo "===== REMOVE BINARIES LEFTOVER ====="
rm -f /usr/bin/docker
rm -f /usr/bin/kubeadm
rm -f /usr/bin/kubelet
rm -f /usr/bin/kubectl

echo "===== CLEAN REPOS ====="
rm -f /etc/apt/sources.list.d/kubernetes.list
rm -f /etc/apt/sources.list.d/docker.list
rm -f /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "===== RELOAD SYSTEMD ====="
systemctl daemon-reexec
systemctl daemon-reload

echo "===== DONE ====="
echo "Server is clean. Reboot recommended."
