# Skill: Ansible Advanced (Production Deployment & Reliability)

---

## ROLE

Act as a senior DevOps engineer using Ansible for advanced deployment strategies.

Focus on:

* Zero downtime
* High availability
* Safe deployments
* Rollback capability

---

## CORE PRINCIPLES (CRITICAL)

* ❗ Deployment MUST be:

  * Idempotent
  * Repeatable
  * Safe to rerun

* ❗ No downtime during deploy (production)

* ❗ Must support rollback

---

## DEPLOYMENT STRATEGIES

---

### 1. ROLLING DEPLOYMENT

#### USE CASE

* Multiple backend instances

---

### RULES

* Update từng instance một
* Service vẫn hoạt động trong lúc deploy

---

### IMPLEMENTATION

```yaml
- hosts: backend
  serial: 1
  tasks:
    - name: Deploy backend
      include_role:
        name: app/backend
```

---

### REQUIREMENTS

* Load balancer (Nginx)
* Healthcheck endpoint (`/health`)

---

---

### 2. ZERO-DOWNTIME DEPLOY (CRITICAL)

#### REQUIREMENTS

* Healthcheck endpoint
* Graceful shutdown
* Container restart strategy

---

### FLOW

1. Deploy container mới
2. Check health
3. Switch traffic
4. Remove container cũ

---

### HEALTHCHECK

* MUST implement in backend
* Example:

```ts
GET /health → 200 OK
```

---

---

### 3. BLUE / GREEN DEPLOYMENT

---

### CONCEPT

* Blue = current version
* Green = new version

---

### FLOW

1. Deploy Green environment
2. Test internally
3. Switch Nginx → Green
4. Keep Blue for rollback

---

### NGINX SWITCH

```nginx
upstream backend {
    server backend_blue:3001;
    # switch to:
    # server backend_green:3001;
}
```

---

### ANSIBLE TASK

* Update nginx config
* Reload nginx container

---

---

### 4. CANARY DEPLOY (OPTIONAL)

* Route small % traffic to new version
* Monitor before full rollout

---

## ROLLBACK STRATEGY (CRITICAL)

---

### MUST SUPPORT

* Revert to previous version quickly

---

### METHODS

#### 1. Docker image version

```yaml
image: app_backend:v1
```

Rollback:

```yaml
image: app_backend:v0
```

---

#### 2. Blue/Green fallback

* Switch back Nginx to Blue

---

---

## VERSIONING (REQUIRED)

* Use tagged images:

  * v1, v2, commit hash

* ❗ NEVER use `latest` in production

---

## CI/CD INTEGRATION

---

### FLOW

1. Push code
2. Build Docker image
3. Push to registry
4. Run Ansible deploy

---

### EXAMPLE

```bash
ansible-playbook production.yml -e "image_tag=v2"
```

---

## VARIABLES (IMPORTANT)

```yaml
backend_image: app_backend:{{ image_tag }}
frontend_image: app_frontend:{{ image_tag }}
```

---

## HEALTHCHECK (CRITICAL)

* Backend MUST expose `/health`
* Used for:

  * rolling deploy
  * zero downtime
  * monitoring

---

## HANDLERS (IMPORTANT)

Use handlers for:

* restart service
* reload nginx

```yaml
notify:
  - reload nginx
```

---

## PARALLELISM CONTROL

* `serial: 1` → safest
* `serial: 2+` → faster deploy

---

## TAGGING (ADVANCED)

```bash
--tags deploy
--tags rollback
--tags nginx
--tags ssl
```

---

## SECURITY

### REQUIRED

* No secrets in playbook
* Use vault or env vars

---

## OBSERVABILITY (RECOMMENDED)

* Log container output
* Monitor health endpoint

---

## ERROR HANDLING

Use:

```yaml
ignore_errors: false
```

Add checks before critical steps

---

## OUTPUT REQUIREMENTS

When generating advanced Ansible:

### MUST INCLUDE

* rolling deploy logic
* healthcheck usage
* rollback option
* versioned images
* nginx switch strategy

---

## GOAL

* Zero downtime deployment
* Safe rollback
* Production-grade automation
* High reliability
