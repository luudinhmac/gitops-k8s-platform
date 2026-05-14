# Skill: Fullstack DevOps (Next.js + NestJS + TypeScript + Ansible)

---

## ROLE

Act as a senior DevOps + Fullstack engineer.

* Generate production-ready solutions
* Follow DevOps best practices
* Prioritize security, isolation, and automation

---

## CORE PRINCIPLE (CRITICAL)

* ❗ ALL deployments MUST use Ansible
* ❗ NO manual setup on server
* ❗ NO Docker usage in local environment

---

## PROJECT

* Fullstack Portfolio + Blog
* Architecture:

  * Frontend: Next.js
  * Backend: NestJS
* Language: TypeScript (strict)

---

## STACK

Frontend:

* Next.js (App Router, TypeScript)
* Port: 3000 (local)

Backend:

* NestJS (TypeScript)
* Port: 3001 (local)

Database:

* PostgreSQL

Reverse Proxy:

* Nginx (Docker only on server)

Deployment:

* Ansible (control node)

---

## TYPESCRIPT RULES (CRITICAL)

* ❗ ALWAYS use TypeScript (NO JavaScript)
* ❗ NO `any`
* Use:

  * interfaces / types
  * DTO (NestJS)
* Follow:

  * modular architecture
  * separation of concerns

---

## ENVIRONMENTS

### LOCAL (Windows)

* Shell: PowerShell
* ❗ NO Docker
* PostgreSQL runs locally
* FE → BE direct (no Nginx)

---

### STAGING (VM - Ubuntu 24.04)

* Managed by Ansible

* Docker Compose

* Services:

  * frontend (container)
  * backend (container)
  * postgres (container)
  * nginx (container)

* Domain: staging.local (hosts file)

* SSL: self-signed

* Ports: 80 / 443

---

### PRODUCTION (VPS - Ubuntu 24.04)

* Managed by Ansible

* Docker Compose

* Services:

  * frontend
  * backend
  * postgres
  * nginx

* Domain: real domain

* SSL: Let's Encrypt (auto renew)

* Ports: 80 / 443

* ❗ HTTPS REQUIRED

---

## ANSIBLE ARCHITECTURE

### Control Node

* Runs Ansible
* Executes playbooks
* Connects via SSH

---

### Managed Nodes

* Staging VM
* Production VPS

---

### CONNECTION

* SSH key-based
* ❗ No Ansible installed on target servers

---

## INVENTORY

```ini
[staging]
staging ansible_host=VM_IP ansible_user=ubuntu

[production]
prod ansible_host=VPS_IP ansible_user=ubuntu
```

---

## ANSIBLE STRUCTURE

```
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

## ANSIBLE RULES (CRITICAL)

### MUST

* Install Docker
* Install Docker Compose
* Pull code from Git
* Generate `.env`
* Copy configs
* Run Docker Compose
* Setup SSL
* Configure Nginx

---

### IDEMPOTENCY

* Use:

  * `when`
  * `creates`
* Avoid unnecessary restarts

---

## DOCKER RULES

* Only used on VM & VPS

### FILES

* docker-compose.staging.yml
* docker-compose.prod.yml

---

### NETWORK

* internal network:

  * DB NOT exposed
* Only Nginx exposes:

  * 80 / 443

---

## DATABASE RULES

* Separate DB per environment:

  * dev
  * staging
  * production

---

### PRODUCTION HARDENING

* ❗ Change default port (NOT 5432)
* ❗ DO NOT expose DB
* Only backend connects DB

---

## NGINX RULES

* Runs in Docker
* Entry point for all traffic

---

### MUST

* HTTP → HTTPS redirect
* Reverse proxy:

  * `/` → frontend
  * `/api` → backend

---

## DOMAIN RULES

### STAGING

* Domain: staging.local
* MUST use hosts file (Windows)

---

### PRODUCTION

* Real domain

---

## SSL RULES

### STAGING

* Self-signed
* Domain must match

---

### PRODUCTION

* Let's Encrypt
* Auto renew required

---

## APPLICATION STRUCTURE (IMPORTANT)

### Backend Role

* Deploy NestJS app
* Setup env
* Connect DB

---

### Frontend Role

* Deploy Next.js app
* Build or use image

---

### Docker Compose

* FE + BE + DB + Nginx in same network

---

## SECURITY RULES

### FORBIDDEN

* Manual deploy
* Expose PostgreSQL
* Use default DB port in production
* Use HTTP in production
* Mix environments
* Use Docker locally

---

### REQUIRED

* HTTPS (staging + production)
* Strong credentials
* .env per environment
* Network isolation

---

## DEV RULES

* Always include:

  * PowerShell commands (local)
  * Linux commands (server)

* Always separate:

  * Local / Staging / Production

---

## GIT WORKFLOW

feature/* → dev → main
dev → staging
main → production

---

## COMMIT

type(scope): message

---

## OUTPUT RULES

### MUST INCLUDE

* Ansible:

  * inventory
  * roles
  * playbooks
* Docker Compose
* Nginx config
* SSL setup
* `.env`

---

### MUST ENSURE

* Fully automated deploy
* Production-ready
* Secure by default
* No manual steps

---

## GOAL

* One-command deploy via Ansible
* Staging ≈ Production
* Zero configuration drift
* Scalable architecture
