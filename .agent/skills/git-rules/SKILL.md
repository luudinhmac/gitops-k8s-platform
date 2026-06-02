# Antigravity Git Skill — Enterprise Workflow Spec

## Context

After every code change, the agent MUST determine whether documentation updates are required.

Documentation updates are REQUIRED when:

- A new feature is added
- An API contract changes
- Environment/setup/install steps change
- Deployment behavior changes
- CI/CD behavior changes

Possible files to update:

- `README.md`
- `API.md`
- `CHANGELOG.md`
- `docs/*`

---

# Role

You are an expert Git workflow and DevOps automation agent.

Your goals:

- Maintain clean Git history
- Enforce safe branching strategy
- Reduce CI/CD failures
- Minimize human error
- Keep documentation synchronized with code

---

# Environment Detection (CRITICAL)

The agent MUST detect the active shell before generating commands.

## Windows PowerShell

Command separator:

```powershell
;
````

Example:

```powershell
git add .; git commit -m "feat(auth): add oauth login"; git push
```

---

## Linux / macOS (bash/zsh)

Command separator:

```bash
&&
```

Example:

```bash
git add . && git commit -m "feat(auth): add oauth login" && git push
```

---

# Shell Rules

* NEVER mix `;` and `&&`
* ALWAYS generate single-line commands
* Prefer chained commands
* Commands MUST be copy-paste ready
* Avoid multiline scripts unless explicitly requested

---

# Branch Strategy

```text
main
 ↑
dev
 ↑
feature/*
```

---

# Branch Rules

* NEVER commit directly to `main`
* ALL development work goes through `dev`
* Feature branches MUST originate from `dev`
* Sync `dev` before starting new work

Required sync command:

## Linux/macOS

```bash
git checkout dev && git pull origin dev
```

## PowerShell

```powershell
git checkout dev; git pull origin dev
```

---

# Branch Naming Convention

## Format

```text
feature/<scope>-<short-name>
fix/<scope>-<short-name>
refactor/<scope>-<short-name>
chore/<scope>-<short-name>
docs/<scope>-<short-name>
```

---

# Naming Rules

* MUST be lowercase
* MUST use kebab-case
* MUST be descriptive
* MUST avoid generic names like:

  * `feature/update`
  * `fix/bug`
  * `refactor/code`

---

# Examples

```text
feature/auth-login
feature/blog-markdown-editor
fix/payment-timeout
refactor/api-response-format
chore/docker-image-cleanup
docs/openstack-installation
```

---

# Commit Convention

## Format

```text
type(scope): short message
```

---

# Allowed Types

* `feat`
* `fix`
* `refactor`
* `chore`
* `docs`

---

# Commit Rules

* MUST include scope
* MUST be written in English
* MUST be concise and descriptive
* SHOULD be ≤ 72 characters
* SHOULD describe intent, not implementation detail

---

# Good Examples

```text
feat(auth): add oauth login flow
fix(api): handle null response payload
refactor(ci): simplify docker build stage
docs(openstack): update kolla deployment guide
```

---

# Bad Examples

```text
update code
fix bug
changes
final
```

---

# Breaking Changes

## Inline notation

```text
feat(api)!: remove v1 endpoints
```

## Footer notation

```text
BREAKING CHANGE: remove deprecated v1 API routes
```

---

# Merge Convention

## Format

```text
type(scope): merge <source> into <target>
```

Example:

```text
feat(auth): merge feature/auth-login into dev
```

---

# Merge Description Template

```text
summary

- change 1
- change 2
- change 3
```

---

# Merge Strategy

Preferred order:

1. Squash merge
2. Platform default merge strategy

Avoid unnecessary merge commits for feature branches.

---

# Documentation Enforcement (STRICT)

The agent MUST verify documentation impact before commit.

## Documentation update REQUIRED if:

* Feature behavior changes
* API request/response changes
* Environment variables change
* Installation/setup changes
* Deployment changes
* CI/CD pipeline changes
* Docker/Kubernetes behavior changes

---

# Quality Checks

Before commit, run if available:

## Node.js

```bash
npm test
npm run lint
npm run build
```

or

```bash
pnpm test
pnpm lint
pnpm build
```

---

## Python

```bash
pytest
ruff check .
```

---

## Go

```bash
go test ./...
```

---

# Quality Rules

* NEVER commit failing builds
* NEVER skip lint/tests silently
* If checks fail:

  * explain failure
  * stop commit generation

---

# Ignored Files (DO NOT COMMIT)

Common exclusions:

```text
node_modules
dist
build
.cache
coverage
logs
*.log
.env
.env.*
```

---

# Safety Rules

* NEVER commit directly to `main`
* NEVER force push shared branches
* NEVER recreate existing branches
* ALWAYS reuse existing feature branch if appropriate
* ALWAYS pull latest `dev` before branching
* ALWAYS verify current branch before commit

---

# Standard Workflow

## Step 1 — Sync dev

### Linux/macOS

```bash
git checkout dev && git pull origin dev
```

### PowerShell

```powershell
git checkout dev; git pull origin dev
```

---

## Step 2 — Create/Re-use branch

Example:

```bash
git checkout -b feature/auth-login
```

---

## Step 3 — Implement changes

* Update code
* Update tests
* Update documentation if required

---

## Step 4 — Run validation

Example:

```bash
pnpm lint && pnpm test && pnpm build
```

---

## Step 5 — Commit

Example:

```bash
git add . && git commit -m "feat(auth): add oauth login"
```

---

## Step 6 — Push

Example:

```bash
git push -u origin feature/auth-login
```

---

# Task Processing Pipeline

When processing repository changes, the agent MUST:

## 1. Detect Change Type

Determine:

* feat
* fix
* refactor
* chore
* docs

---

## 2. Detect Scope

Examples:

* auth
* api
* ci
* docker
* kubernetes
* monitoring
* payment

---

## 3. Detect Environment

Determine:

* PowerShell
* bash
* zsh

---

## 4. Generate Commit Message

Follow commit convention strictly.

---

## 5. Generate Optimized Git Commands

Rules:

* single-line only
* shell-compatible
* copy-paste ready

---

## 6. Determine Documentation Impact

Output:

```text
README.md Update: Required
Reason: API response structure changed
```

or

```text
README.md Update: Not required
Reason: Internal refactor only
```

---

# Required Output Format

## Commit Message

```text
feat(auth): add oauth login flow
```

---

## Git Commands

### Linux/macOS

```bash
git add . && git commit -m "feat(auth): add oauth login flow" && git push
```

### PowerShell

```powershell
git add .; git commit -m "feat(auth): add oauth login flow"; git push
```

---

## README.md Update

```text
Required
Reason: Added new authentication setup instructions
```

---

# Primary Goal

Maintain:

* safe Git workflow
* automation-friendly repositories
* clean commit history
* CI/CD consistency
* synchronized documentation
* scalable team collaboration