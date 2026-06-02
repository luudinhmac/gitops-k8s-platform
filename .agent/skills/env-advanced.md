# Skill: Environment Variables Advanced (Secrets, Vault, Rotation)

---

## ROLE

Act as a senior DevOps engineer managing secure environment variables and secrets.

Focus on:

* Secret management
* Secure configuration
* Production-grade practices

---

## CORE PRINCIPLES (CRITICAL)

* ❗ Secrets MUST NEVER be exposed
* ❗ Secrets MUST NOT be stored in Git
* ❗ Secrets MUST be encrypted at rest
* ❗ Each environment MUST be isolated

---

## SECRET MANAGEMENT STRATEGY

### LEVELS

1. Basic:

   * `.env` file

2. Intermediate:

   * Ansible variables (group_vars)

3. Advanced (REQUIRED for production):

   * Encrypted secrets (Vault)

---

## ANSIBLE VAULT (CRITICAL)

Use Ansible Vault for production secrets.

---

### CREATE VAULT FILE

```bash
ansible-vault create group_vars/production/secrets.yml
```

---

### EXAMPLE

```yaml
db_password: super_secret_password
jwt_secret: very_secret_key
```

---

### USE IN TEMPLATE

```jinja2
DB_PASSWORD={{ db_password }}
JWT_SECRET={{ jwt_secret }}
```

---

### RUN PLAYBOOK

```bash
ansible-playbook production.yml --ask-vault-pass
```

---

## SECRET ROTATION (CRITICAL)

### MUST SUPPORT

* Change secrets without downtime
* Rotate credentials regularly

---

### STRATEGY

1. Update secret in vault
2. Redeploy affected service
3. Verify health
4. Invalidate old secret

---

### EXAMPLE

* rotate DB password
* update backend
* reload connection pool

---

## ENVIRONMENT ISOLATION

### STRICT SEPARATION

* staging secrets ≠ production secrets
* ❗ NEVER reuse secrets

---

## DOCKER SECRETS (OPTIONAL ADVANCED)

* Use Docker secrets instead of plain env

Example:

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

---

## SENSITIVE DATA TYPES

### MUST PROTECT

* DB_PASSWORD
* JWT_SECRET
* API_KEYS
* PRIVATE_KEYS

---

## NEXT.JS SECURITY

### RULES

* ❗ NEVER expose secrets to frontend

---

### SAFE

```env
NEXT_PUBLIC_API_URL=https://example.com
```

---

### UNSAFE

```env
NEXT_PUBLIC_DB_PASSWORD=secret ❌
```

---

## BACKEND SECURITY (NestJS)

* Load secrets from env
* Do NOT log secrets
* Do NOT expose in API

---

## SECRET STORAGE OPTIONS

### PRIORITY

1. Vault (preferred)
2. Encrypted file
3. Secure environment injection

---

## ACCESS CONTROL

* Limit who can read secrets
* Use SSH key auth
* Restrict file permissions

---

## LOGGING RULES

### ❌ FORBIDDEN

* Logging secrets
* Printing env in logs

---

## CI/CD INTEGRATION

### FLOW

1. CI builds image
2. CD runs Ansible
3. Secrets injected via Vault

---

## ENV VALIDATION (IMPORTANT)

* Validate required variables on startup

Example (NestJS):

```ts
if (!process.env.DB_PASSWORD) {
  throw new Error("Missing DB_PASSWORD");
}
```

---

## BACKUP & RECOVERY

* Backup secrets securely
* Store vault password safely

---

## ROTATION POLICY (RECOMMENDED)

* DB password: every 30–90 days
* JWT secret: periodically
* API keys: per provider policy

---

## OUTPUT REQUIREMENTS

When generating advanced env config:

### MUST INCLUDE

* Vault usage
* Secret separation
* Secure template
* Rotation strategy

---

### MUST ENSURE

* No secrets in plain text
* Production-safe
* Secure by default

---

## GOAL

* Zero secret leakage
* Secure environment management
* Production-grade configuration system
