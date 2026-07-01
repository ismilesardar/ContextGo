# Code Standards

## TypeScript

- Strict mode is required — `noImplicitAny`, `strictNullChecks`, etc.
- Never use `any` — use explicit interfaces or `unknown` with narrowing
- Validate unknown external input with Zod at API boundaries; infer types via `z.infer<typeof schema>`
- `PascalCase` for types/interfaces, `camelCase` for variables/functions, `kebab-case` for files and folders
- Constants: `SCREAMING_SNAKE_CASE` at module level, `camelCase` otherwise

## Next.js (App Router)

- Default to Server Components — add `'use client'` only when browser APIs, hooks, or interactivity require it
- Never use `next/dynamic` with `{ ssr: false }` inside a Server Component — wrap client-only logic in a `'use client'` component instead
- `cookies()`, `headers()`, `params`, `searchParams` are async in Next.js 16 — always `await` them
- Do not call your own API routes from Server Components — call shared logic from `src/lib/` directly
- Route groups: use `(name)` to group without affecting the URL
- API routes: validate input → check auth → run business logic → return response

## Feature Organization

- Every new feature goes in `src/features/<feature-name>/`
- Shared logic across features goes in `src/lib/`
- Shared UI components (not feature-specific) go in `src/components/`
- Do not import between sibling feature folders — route through `src/lib/` or `src/components/`

## Auth & Session

- Use `src/lib/auth/auth-session.ts` for all server-side session reads
- Auth config is in `src/lib/auth/auth.ts` — inspect before touching auth or billing logic
- No `middleware.ts` exists — all auth checks are explicit in server components / route handlers

## Data Fetching

- All client-side data fetching uses React Query — configured in `src/lib/api-setting/`
- All HTTP requests from the client use Axios — configured in `src/lib/api-setting/`
- URL search params state uses `nuqs`
- Tables use `@tanstack/react-table`

## Forms

- All forms use `react-hook-form` + Zod schema + `@hookform/resolvers/zod`
- Define the Zod schema first in `src/lib/zod-schema/`, infer the type, pass to `useForm<T>`

## Styling

- Tailwind CSS 4 only — no hardcoded hex values, use CSS custom property tokens
- Use `cn()` from `src/lib/utils.ts` for conditional class merging
- Class ordering managed by Prettier — do not manually reorder
- Responsive prefixes for breakpoints, `focus-visible:` for focus states, `aria-invalid:` for form errors

## Naming

| Thing | Convention |
|-------|-----------|
| Files & folders | `kebab-case` |
| Components | `PascalCase` (filename matches export) |
| Hooks | `camelCase`, prefixed `use` |
| Types/interfaces | `PascalCase` |
| Variables/functions | `camelCase` |
| Module-level constants | `SCREAMING_SNAKE_CASE` |

## Tooling

- Package manager: `pnpm` only
- Linting: ESLint 9 — use `pnpm eslint` (not `next lint`)
- Formatting: Prettier 3 — let it handle Tailwind class ordering
- Type check: `pnpm tsc --noEmit` — run before marking any task done
- Git hooks: Husky + lint-staged run on pre-commit automatically
