# Project Architecture & Logic Guidelines

This document outlines the required standards for modularity, maintainability, and visual excellence in the Portfolio & Blog project.

## 1. Modular API Architecture
All API interactions MUST be centralized in the `src/services/` directory.

- **Rule**: No direct use of `fetch`, `axios`, or private environment variables inside components.
- **Service Pattern**:
  ```typescript
  // src/services/exampleService.ts
  import axiosInstance from '@/lib/axios';

  export const exampleService = {
    getAll: async () => {
      const response = await axiosInstance.get('/examples');
      return response.data;
    },
    // ... other methods
  };
  ```
- **Usage**: Components should call services within `useEffect` or dedicated hooks.

## 2. UI Consistency & Standardized Components
Maintain a premium, uniform aesthetic by strictly using shared UI components.

- **Buttons**: Always use `src/components/ui/Button.tsx`.
  - Primary (Blue): Add/Create/Primary actions.
  - Amber/Yellow: Edit/Warning actions.
  - Red/Destructive: Delete/Danger actions.
- **Badges**: Use `src/components/common/Badge.tsx` or `src/components/ui/IconBadge.tsx`.
- **Containers**: Use `AdminCard` or `AdminPageHeader` for dashboard consistency.
- **Transitions**: Use `AnimateList` for all dynamic mapping of items to ensure smooth entry.

## 3. Logic & Utilities
Centralize pure logic and formatting to avoid duplication.

- **Slug Generation**: Use `slugify` from `src/lib/utils.ts` for all URL generation.
- **Date Formatting**: Use `FormattedDate` component or centralized utilities.
- **Hooks**: Abstract complex logic into hooks (e.g., `usePostActions`) to keep components clean.

## 4. Design Standards (Premium Feel)
- **Rounded Corners**: Use large border-radius (e.g., `rounded-2xl`, `rounded-3xl`, `rounded-[2.5rem]`).
- **Glassmorphism**: Use the `.glass` utility for cards and floating elements.
- **Shadows**: Use soft, colored shadows (e.g., `shadow-primary/20`) instead of harsh black shadows.
- **Micro-animations**: Every interactive element should have a hover/active state (scale, translate, or color shift).

## 5. Security & Authentication
- Always check `isAuthenticated` and `loading` from `AuthContext` before rendering protected content.
- Use `authService` for all authentication flows.
- Ensure `credentials: 'include'` or proper Axios interceptors are used for cookie-based auth.

## 6. Cleanup Rule
Always remove "legacy" fetch calls or hardcoded styles when refactoring a component to the modular architecture.
