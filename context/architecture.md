# Architecture

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 + React 19 + TypeScript 5 | App Router, strict mode |
| Styling | Tailwind CSS 4 + shadcn/ui + Radix UI | Components in `src/components/ui/` |
| Auth | Better Auth 1.5 | Prisma adapter, OAuth, 2FA, passkeys |
| Database | Prisma 7 + PostgreSQL | `prisma/schema.prisma` |
| Server state | React Query 5 (`@tanstack/react-query`) | All client-side data fetching |
| Client state | Zustand 5 | Stores in `src/store/` |
| Forms | React Hook Form 7 + Zod 4 | `@hookform/resolvers` |
| Billing | Stripe + Creem | Better Auth plugins in `src/lib/auth/auth.ts` |
| Storage | AWS SDK v3 (Backblaze B2 S3-compatible) | Utilities in `src/lib/storage/` |
| Email | Nodemailer | `src/lib/send-mail.ts` |
| Rate limiting | Arcjet | `@arcjet/next` |
| Error tracking | Sentry | `src/instrumentation.ts` |
| Icons | Lucide React + Tabler Icons | |
| Rich text editor | Tiptap 3 (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/markdown`) | `src/components/editor/` — content persisted as Markdown, rendered read-only via `src/components/share/markdown.tsx` (`react-markdown` + `remark-gfm`) |
| Package manager | pnpm 10 | Node 22 |

## Folder Ownership

| Folder | What lives here |
|--------|----------------|
| `src/app/` | Routing, layouts, pages, route handlers |
| `src/features/` | Feature modules — all new features go here |
| `src/lib/` | Shared business logic, API clients, utilities |
| `src/components/` | Shared UI components (not feature-specific) |
| `src/components/ui/` | shadcn/ui components — managed by CLI, do not edit manually |
| `src/store/` | Zustand state stores |
| `src/hooks/` | Custom React hooks |
| `src/types/` | Global TypeScript type definitions |
| `src/config/` | App-level configuration and constants |
| `src/utils/` | Misc utility functions |
| `prisma/` | Schema and migrations |

## Key File Locations

| Concern | File |
|---------|------|
| Auth config (server) | `src/lib/auth/auth.ts` |
| Auth client | `src/lib/auth/auth-client.ts` |
| Session access (server) | `src/lib/auth/auth-session.ts` |
| Billing plans | `src/lib/plans/` |
| Permissions/RBAC | `src/lib/permissions/` |
| Storage helpers | `src/lib/storage/` |
| Email sender | `src/lib/send-mail.ts` |
| React Query / Axios setup | `src/lib/api-setting/` |
| Zod schemas | `src/lib/zod-schema/` |
| URL config | `src/config/url.config.ts` |
| Rich text editor / viewer (shared, reused by every resource type) | `src/components/editor/rich-text-editor.tsx`, `rich-text-viewer.tsx` |

## Auth & Access Model

- All users authenticate via Better Auth (OAuth, email/password, passkeys, 2FA)
- There is **no `middleware.ts`** — auth checks are done server-side in `src/lib/auth/auth-session.ts`
- Organizations/workspaces are the top-level resource; users belong via `Member` records with roles
- Billing is per organization via Stripe subscriptions tracked in the `Subscription` model

## Storage Model

| Store | What lives here |
|-------|----------------|
| PostgreSQL | All metadata, user records, org data, subscriptions, relationships |
| Backblaze B2 (S3) | User-uploaded files, generated images, large artifacts |

## Invariants

1. Server Components are the default — only add `use client` when browser APIs or interactivity require it.
2. Route handlers do not run long-lived background work — use `node-cron` jobs in `src/lib/cron/` instead.
3. Validate all external input at system boundaries (API routes, server actions) using Zod before any logic runs.
4. All database access goes through Prisma — no raw SQL unless absolutely necessary.
5. Do not call your own API routes from Server Components — extract shared logic into `src/lib/` and call it directly.
