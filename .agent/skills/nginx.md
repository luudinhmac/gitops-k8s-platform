# Skill: Nginx (Docker + Reverse Proxy + SSL)

---

## ROLE

Act as a senior DevOps engineer configuring Nginx.

* Configure reverse proxy
* Handle SSL termination
* Ensure secure, production-ready setup

---

## CORE PRINCIPLES (CRITICAL)

* ❗ Nginx ALWAYS runs in Docker (server only)
* ❗ Nginx is the ONLY public entry point
* ❗ All traffic must go through Nginx
* ❗ NEVER expose backend or database directly

---

## ARCHITECTURE

```text
Internet
   ↓
Nginx (80/443)
   ↓
-------------------------
| Frontend (Next.js)
| Backend (NestJS)
| PostgreSQL (internal)
-------------------------
```

---

## PORT RULES

### STAGING & PRODUCTION

* 80 → HTTP (redirect)
* 443 → HTTPS

---

## REQUIRED CONFIGURATION

---

### 1. HTTP → HTTPS REDIRECT (MANDATORY)

```nginx id="3a1g6p"
server {
    listen 80;
    server_name _;

    return 301 https://$host$request_uri;
}
```

---

### 2. HTTPS SERVER

```nginx id="m7f3lp"
server {
    listen 443 ssl;
    server_name DOMAIN;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
    }

    location /api {
        proxy_pass http://backend:3001;
    }
}
```

---

## ROUTING RULES

* `/` → frontend (Next.js)
* `/api` → backend (NestJS)

---

## DOCKER INTEGRATION

### Nginx container MUST:

* Mount config:

```bash id="r3pmfh"
/etc/nginx/conf.d
```

* Mount SSL:

```bash id="8nxrfx"
/etc/nginx/ssl
```

---

### Example Compose

```yaml id="3o2r6j"
nginx:
  image: nginx:latest
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/conf.d:/etc/nginx/conf.d
    - ./ssl:/etc/nginx/ssl
  depends_on:
    - frontend
    - backend
```

---

## SSL STRATEGY

---

### STAGING

* Self-signed certificate
* Must match domain (staging.local)

---

### PRODUCTION

* Let's Encrypt
* Auto renew required

---

## SECURITY RULES (CRITICAL)

### ❌ FORBIDDEN

* Expose backend port
* Expose database port
* Use HTTP only
* Disable SSL in production

---

### ✅ REQUIRED

* HTTPS only
* Strong SSL config
* Secure headers

---

## SECURITY HEADERS (RECOMMENDED)

```nginx id="s5i0fq"
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000" always;
```

---

## PERFORMANCE (RECOMMENDED)

```nginx id="r7l94k"
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## WEBSOCKET SUPPORT

```nginx id="o7y2mj"
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

---

## HEALTHCHECK SUPPORT

* Allow `/health` pass-through to backend

---

## DOMAIN RULES

### STAGING

* server_name staging.local

---

### PRODUCTION

* server_name yourdomain.com

---

## RELOAD STRATEGY

* Use:

```bash id="z7l4fp"
nginx -s reload
```

* Prefer reload over restart

---

## ANSIBLE INTEGRATION

* Config MUST be deployed via Ansible
* No manual editing on server

---

## OUTPUT REQUIREMENTS

When generating Nginx config:

### MUST INCLUDE

* HTTP → HTTPS redirect
* SSL config
* Reverse proxy rules
* Docker volume mount
* Security headers

---

### MUST ENSURE

* Production-ready
* Secure by default
* Works with Docker Compose

---

## GOAL

* Single secure entry point
* Zero direct access to internal services
* Production-grade reverse proxy
