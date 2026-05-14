# Skill: Environment Variables (.env Management)

---

## ROLE

Act as a senior DevOps engineer managing environment variables.

* Ensure correct configuration per environment
* Prevent secret leakage
* Maintain separation between environments

---

## CORE PRINCIPLES (CRITICAL)

* ❗ NEVER hardcode secrets in code
* ❗ ALWAYS use `.env` files
* ❗ EACH environment MUST have its own `.env`

---

## ENV FILE STRUCTURE

### REQUIRED FILES

* `.env.local`
* `.env.staging`
* `.env.production`
* `.env.example`

---

## ENVIRONMENT SEPARATION

### LOCAL

```env
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_dev
DB_USER=postgres
DB_PASSWORD=local_password

API_URL=http://localhost:3001
```

---

### STAGING

```env
NODE_ENV=staging

DB_HOST=postgres
DB_PORT=5432
DB_NAME=portfolio_staging
DB_USER=app_user
DB_PASSWORD=staging_password

DOMAIN=staging.local
API_URL=https://staging.local/api
```

---

### PRODUCTION

```env
NODE_ENV=production

DB_HOST=postgres
DB_PORT=55432
DB_NAME=portfolio_prod
DB_USER=app_user
DB_PASSWORD=strong_password

DOMAIN=yourdomain.com
API_URL=https://yourdomain.com/api
```

---

## RULES FOR DATABASE

* ❗ Separate DB per environment
* ❗ Production MUST NOT use default port (5432)
* ❗ DB_HOST in Docker = service name (e.g. postgres)

---

## NEXT.JS RULES

* Public variables MUST start with:

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

* ❗ NEVER expose secrets with NEXT_PUBLIC_

---

## NESTJS RULES

* Use environment variables via ConfigModule
* Example:

```ts
ConfigModule.forRoot({
  isGlobal: true,
})
```

---

## ANSIBLE INTEGRATION

### MUST

* `.env` generated via Ansible
* DO NOT commit real `.env` to Git

---

### TEMPLATE EXAMPLE

```yaml
- name: Generate .env
  template:
    src: env.j2
    dest: /app/.env
```

---

## DOCKER INTEGRATION

```yaml
env_file:
  - .env
```

---

## SECURITY RULES (CRITICAL)

### ❌ FORBIDDEN

* Commit `.env.production`
* Hardcode secrets in code
* Use same credentials across environments

---

### ✅ REQUIRED

* Use strong passwords
* Use different values per environment
* Store secrets securely (Ansible vars / vault)

---

## ENV NAMING CONVENTION

* Uppercase
* Snake case

```env
DB_HOST
JWT_SECRET
API_URL
```

---

## COMMON VARIABLES

```env
NODE_ENV=
PORT=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=

DOMAIN=
API_URL=
```

---

## OUTPUT REQUIREMENTS

When generating env config:

### MUST INCLUDE

* .env per environment
* .env.example
* Explanation if needed

---

### MUST ENSURE

* No secrets leaked
* Production-safe values
* Correct per environment

---

## GOAL

* Secure configuration
* Clear environment separation
* Zero configuration mistakes
