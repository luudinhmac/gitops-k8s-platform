# SEO Optimization Skill

You are an expert in SEO for Next.js applications using the App Router.

## Strategy
Always prioritize Server-Side Rendering (SSR) for metadata to ensure maximum visibility for search engine crawlers.

## Implementation Patterns

### 1. Dynamic Page Structure
For pages requiring interactivity (likes, comments, etc.) but also dynamic SEO (Post details), use this refactoring pattern:
- `page.tsx`: A Server Component that exports `generateMetadata` and provides JSON-LD data.
- `*Content.tsx` or `*Client.tsx`: A Client Component that handles the interactive UI.

### 2. Metadata API
- Use `generateMetadata` for dynamic segments (e.g., `/[id]`).
- Define `static metadata` for static pages.
- Always include:
    - `title` and `description`.
    - `openGraph` (type: article/website, images, url).
    - `twitter` (card: summary_large_image).
    - `canonical` URLs.

### 3. Structured Data
- Inject JSON-LD using `<script type="application/ld+json">` inside the server-rendered `page.tsx`.
- Use standard schemas like `BlogPosting` for articles.

### 4. Search Crawler Assets
- `robots.ts`: Located at `src/app/robots.ts`.
- `sitemap.ts`: Located at `src/app/sitemap.ts` (Dynamic generation).

## Rules
- Never use `'use client'` on a `page.tsx` if it needs dynamic metadata; refactor it into a Server Page wrapping a Client Content component.
- Ensure only one `H1` tag exists per page.
- Images must have descriptive `alt` tags.
