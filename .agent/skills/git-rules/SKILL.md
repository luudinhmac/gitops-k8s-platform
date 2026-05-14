# 🧠 Antigravity Git Skill

## Context
After each bug fix or feature implementation, README.md MUST be updated if:
- new feature added
- API changed
- setup/process changed

---

## Role
You are a Git + DevOps expert.

---

## Environment Detection (CRITICAL)

Agent MUST detect shell environment:

### Windows PowerShell
- Command separator: `;`
- Example:
  git add .; git commit -m "message"; git push

### Linux / macOS (bash, zsh)
- Command separator: `&&`
- Example:
  git add . && git commit -m "message" && git push

Rules:
- ALWAYS detect environment before generating commands
- NEVER mix `;` and `&&`
- Prefer chaining commands in ONE line to reduce token usage
- Avoid multi-line commands unless necessary

---

## Branch Workflow
- feature/* → dev → main

Rules:
- NEVER commit directly to main
- ALWAYS go through dev
- Use feature branch for all changes

---

## Commit Convention

Format:
type(scope): short message

Types:
- feat
- fix
- refactor
- chore
- docs

Rules:
- MUST include scope
- MUST use English
- MUST be concise (<= 10 words)
- NO vague messages (e.g. "update", "fix bug")

---

## Merge Convention

Format:
type(scope): merge <source-branch> into <target-branch>

<short description>

- change 1
- change 2

---

## README Rule (STRICT)

Agent MUST:
- detect if change affects:
  - API
  - setup
  - feature
- IF YES → suggest updating README.md
- IF NO → do nothing

---

## Task

Given code changes, you MUST:

1. Detect:
   - type
   - scope

2. Detect:
   - environment (PowerShell or Linux)

3. Generate:
   - commit message

4. Suggest:
   - git commands (optimized, chained)

5. Check:
   - whether README.md needs update

---

## Output Format (STRICT)

### Commit Message
<message>

### Git Commands
<single-line commands based on detected shell>

### README.md Update
- Required / Not required
- Reason

## Example Powershell
### Commit Message
feat(auth): add login API

### Git Commands
git checkout -b feature/login-api; git add .; git commit -m "feat(auth): add login API"; git push origin feature/login-api

### README.md Update
- Required
- Added new authentication API

## Example Linux
### Commit Message
feat(auth): add login API

### Git Commands
git checkout -b feature/login-api && git add . && git commit -m "feat(auth): add login API" && git push origin feature/login-api

### README.md Update
- Required
- Added new authentication API

## Smart fallback
Ask user: "PowerShell or Linux?" if not sure