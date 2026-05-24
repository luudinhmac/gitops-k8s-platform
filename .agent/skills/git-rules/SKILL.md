# Antigravity Git Skill (Improved Spec)

## Context

After each code change:

- If a new feature is added
- If API changes
- If setup or install process changes

MUST update `README.md` (or related documentation).

---

## Role

You are a Git + DevOps expert agent.

---

## Environment Detection (CRITICAL)

The agent MUST detect shell environment before generating commands.

### Windows PowerShell

- Command separator: `;`

```bash
git add .; git commit -m "message"; git push
Linux / macOS (bash/zsh)
Command separator: &&
git add . && git commit -m "message" && git push
Rules
NEVER mix ; and &&
ALWAYS use single-line commands
Prefer chained commands
Branch Workflow
main
 ↑
dev
 ↑
feature/*
Rules
NEVER commit directly to main
ALL changes go through dev
Feature branches must be created from dev
Branch Naming Convention
feature/<scope>-<short-name>
fix/<scope>-<short-name>
refactor/<scope>-<short-name>
chore/<scope>-<short-name>
docs/<scope>-<short-name>
Examples
feature/auth-login
fix/payment-timeout
refactor/api-response
Rules
MUST be lowercase
MUST be descriptive
Commit Convention
Format
type(scope): short message
Types
feat
fix
refactor
chore
docs
Rules
MUST include scope
MUST be in English
MUST be clear and specific
SHOULD be ≤ 72 characters
Breaking Change
feat(api)!: remove v1 endpoints

OR

BREAKING CHANGE: describe change
Merge Convention
Format
type(scope): merge <source> into <target>

summary

- change 1
- change 2
Strategy
Prefer squash merge
Or use platform default (GitHub/GitLab)
README / Documentation Rule (STRICT)

The agent MUST update documentation if:

New feature added
API modified
Setup or install process changed
Allowed files
README.md
API.md
CHANGELOG.md
docs/*
Quality Checks (if available)

Before commit:

Run tests
Run lint
Run build
Ignored Files (DO NOT COMMIT)
node_modules
dist
build
cache
logs (if auto-generated)
Safety Rules
NEVER commit directly to main
NEVER force push to shared branches
If branch exists → reuse it (do not recreate)
Always sync dev before feature work
git checkout dev && git pull origin dev
Task Pipeline

When processing changes:

Detect change type:
feat / fix / refactor / chore / docs
Detect scope
Detect environment:
PowerShell or Linux/macOS
Generate commit message
Generate optimized git commands (single line)
Check whether README.md or docs update is required
Output Format
Commit Message
<message>
Git Commands
<single-line commands based on detected shell>
README.md Update
Required / Not required
Reason
Goal
Safe Git workflow
Clean commit history
CI/CD friendly structure
Minimal human error
Automation ready