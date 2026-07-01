---
description: "Architecture-first change workflow for this workspace"
applyTo: "src/**/*.{ts,tsx,js,jsx}, prisma/**/*"
---

# Architecture-First Change Workflow

## Purpose
Use this workflow for any code change that may affect product structure, Prisma data access, shared models, or multiple features.

## Workflow
1. Review the requested change and identify the primary feature, related features, and shared layers it touches.
2. Check the current architecture before editing:
   - `src/features/`
   - `src/lib/`
   - `src/components/`
   - `src/store/`
   - `src/hooks/`
   - `src/types/`
   - `src/utils/`
   - `src/config/`
   - `src/app/api/`
   - `prisma/`
3. Prefer existing patterns and abstractions over new ad hoc code.
4. Keep Prisma queries, models, and data access standard and centralized.
5. Split dependencies and related logic into multiple files when the task naturally requires it.
6. Before editing, check for side effects on other features, shared utilities, and data flow.
7. Make the smallest safe change that preserves the product architecture.
8. After the change, verify that no obvious regressions were introduced.

## Decision Rules
- If a change can reuse an existing feature, helper, or model, reuse it.
- If a change would duplicate shared logic, extract a dependency instead.
- If a change crosses feature boundaries, inspect all impacted files before editing.
- If the change touches Prisma, keep schema, query, and model updates consistent.
- If a change touches authentication or session management, inspect `src/lib/auth/` (Better Auth config, client, session helpers) before editing.
- If a change involves billing or subscriptions, inspect `src/features/billing/`, `src/lib/auth/auth.ts` (Stripe + Creem plugin config), and `src/lib/plans/` before editing.
- Do not introduce throwaway or unrelated code.

## Completion Check
- The change follows the existing product architecture.
- Dependencies are placed in the correct files.
- Prisma-related code remains standard and consistent.
- Potential regressions were considered before editing.
