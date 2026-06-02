# 🚀 Portfolio Project

A modern, scalable portfolio platform built with **Next.js** and **NestJS**, following a clean architecture focused on performance, SEO, and maintainability.

---

## 🧭 Tech Stack

- Frontend: Next.js (App Router)
- Backend: NestJS
- Architecture: Feature-based + Smart Server / Lean Client

---

## ⚖️ Core Principles

### 🧠 Smart Server – Lean Client

**Backend handles:**
- Business logic
- Data filtering, sorting, pagination
- Aggregation (counts, computed fields)
- Validation & security

**Frontend handles:**
- UI rendering
- User interaction
- Small UI-level data transformations

---

### 🚫 Anti-patterns

- Filtering/sorting large datasets on frontend
- Business logic in frontend
- Excessive API calls for UI-only interactions

---

## 🔄 Data Fetching Strategy

### 🟢 Server Components (Default)
Use for:
- SEO pages (blog, project detail)
- Static or low-interaction content

```ts
const data = await fetch('/api/posts', { next: { revalidate: 60 } })
🔵 Client Components

Use for:

Interactive UI (modals, dropdowns)
Real-time updates
🟡 Server State

Use libraries like:

React Query
SWR

Always handle:

loading
error
retry
🧊 Caching Strategy
Data Type	Strategy
Static content	Long cache
User-specific	no-store
List data	Revalidate
🧱 Project Structure
src/
 ├── app/                     # Routing (Next.js)
 ├── features/                # Feature-based modules
 │    ├── post/
 │    │    ├── components/
 │    │    ├── services/
 │    │    ├── hooks/
 │    │    └── types.ts
 │    ├── user/
 │
 ├── shared/
 │    ├── components/
 │    │    ├── ui/           # Atomic components
 │    │    └── common/       # Shared components
 │    ├── lib/               # Utilities
 │    └── constants/
🚧 Domain Rules
❌ Do NOT import logic across features
✅ Use shared modules or API layer instead
🧠 State Management
State Type	Solution
UI State	useState
Server State	React Query / SWR
Global State	Zustand (if needed)
🚫 Anti-patterns
Using global state for API data
Duplicating state across components
📦 Import Rules

✅ Good:

import Button from '@/shared/components/ui/Button'

❌ Bad:

import Button from '../../../components/Button'
🧾 Type Safety
Use shared types from @portfolio/contracts
Do NOT redefine core models (Post, User, etc.)
API Call Example
try {
  const data = await api.getPosts()
} catch (err) {
  // handle error
}
🔌 Backend API Standards
Query Parameters
Param	Description
q	Search keyword
userId	Filter by user
status	published, draft, etc.
sort	latest, views, likes
page	Page number
limit	Items per page
Response Format
{
  data: T[],
  meta: {
    page: number,
    limit: number,
    total: number
  }
}
Error Format
{
  message: string,
  code: string,
  status: number
}
🎨 UX Standards
Loading
Prefer Skeleton over Spinner
Skip loading if < 300ms
Error Handling
Clear and actionable messages
Feedback
Use Toasts / Dialogs for important actions
Animation
Use Framer Motion (lightweight & controlled)
🔍 SEO Standards
Use Server Components for content pages
Provide metadata:
title
description
open graph
Semantic HTML
<article>
<nav>
<aside>
⚡ Performance Guidelines
✅ Do
Lazy load heavy components
Optimize images
Use code splitting
❌ Avoid
Over-fetching data
Unnecessary re-renders
📊 Logging & Monitoring
Backend
Request logging
Error logging
Frontend
Error tracking (e.g. Sentry)
🎯 Philosophy

Server handles logic. Client delivers experience.