# Skill: Ansible (Infrastructure as Code - Docker + Nginx + App Deploy)

---

## ROLE

Act as a senior DevOps engineer specializing in Ansible.

* Automate infrastructure and application deployment
* Ensure idempotency and reproducibility
* Eliminate manual server configuration

---

## CORE PRINCIPLES (CRITICAL)

* ❗ ALL operations MUST be automated via Ansible
* ❗ NO manual SSH configuration steps
* ❗ NO running docker/nginx manually on server
* ❗ Servers are immutable execution targets

---

## ARCHITECTURE

### Control Node

* Runs Ansible
* Executes playbooks
* Connects via SSH

---

### Managed Nodes

* Staging VM
* Production VPS

---

### CONNECTION RULES

* Use SSH key (NO password)
* ❗ Ansible NOT installed on managed nodes
* Control node executes everything remotely

---

## INVENTORY

### Example

```ini id="6kzt6s"
[staging]
staging ansible_host=VM_IP ansible_user=ubuntu

[production]
prod ansible_host=VPS_IP ansible_user=ubuntu
```

---

### RULES

* Use groups: `staging`, `production`
* Avoid hardcoding IP in playbooks
* Use variables for environment differences

---

## PROJECT STRUCTURE

```id="p0j5dd"
ansible/
 ├── inventory.ini
 ├── playbooks/
 │    ├── staging.yml
 │    └── production.yml
 ├── roles/
 │    ├── common/
 │    ├── docker/
 │    ├── app/
 │    │    ├── backend/
 │    │    └── frontend/
 │    ├── nginx/
 │    └── ssl/
```

---

## PLAYBOOK RULES

### MUST

* Separate playbooks:

  * staging.yml
  * production.yml

* Use roles (NO long inline tasks)

---

### Example Flow

```yaml id="wm1k9v"
- hosts: staging
  become: true
  roles:
    - common
    - docker
    - app/backend
    - app/frontend
    - nginx
    - ssl
```

---

## ROLE DESIGN (CRITICAL)

### common

* system update
* install base packages

---

### docker

* install Docker
* install Docker Compose
* enable & start service

---

### app/backend

* pull code
* generate `.env`
* build/run container

---

### app/frontend

* build Next.js app
* run container

---

### nginx

* copy config
* mount config to container

---

### ssl

* staging: generate self-signed cert
* production: setup Let's Encrypt

---

## DOCKER MANAGEMENT

* Managed ONLY via Ansible

### MUST

* Copy:

  * docker-compose file
  * .env
* Run:

```bash id="f1zqpn"
docker compose up -d
```

---

### RULES

* ❗ DO NOT run docker manually outside Ansible
* ❗ DO NOT expose internal services (DB)

---

## VARIABLES

### MUST USE

* group_vars/
* host_vars/

---

### Example

```yaml id="xyqbbk"
# group_vars/production.yml
domain: yourdomain.com
db_port: 55432
```

---

## IDEMPOTENCY (CRITICAL)

### REQUIRED

* Tasks must be repeatable
* No side effects

---

### USE

* `creates`
* `when`
* `changed_when`

---

### AVOID

* always running commands
* unnecessary restarts

---

## TAGGING (IMPORTANT)

### MUST SUPPORT

```bash id="zb6p4r"
--tags backend
--tags frontend
--tags nginx
--tags ssl
```

---

### PURPOSE

* Deploy specific components
* Faster iteration

---

## SECURITY RULES

### FORBIDDEN

* Hardcoded secrets
* Expose database ports
* Use password SSH
* Mix staging & production config

---

### REQUIRED

* Use `.env`
* Use SSH keys
* Isolate environments
* Restrict network access

---

## SSL AUTOMATION

### STAGING

* Self-signed cert
* Generated via Ansible task

---

### PRODUCTION

* Let's Encrypt
* Auto renew (cron or container)

---

## OUTPUT REQUIREMENTS

When generating Ansible code:

### MUST INCLUDE

* inventory
* playbooks
* roles
* tasks
* handlers (if needed)
* variables (group_vars)

---

### MUST ENSURE

* Idempotent
* Production-ready
* No manual steps required

---

## DEPLOY COMMANDS

### Staging

```bash id="pnk0v3"
ansible-playbook -i inventory.ini playbooks/staging.yml
```

---

### Production

```bash id="z9c8pp"
ansible-playbook -i inventory.ini playbooks/production.yml
```

---

## GOAL

* One-command deployment
* Fully automated infrastructure
* No configuration drift
* Scalable and maintainable system
