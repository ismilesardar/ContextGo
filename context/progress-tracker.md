# Progress Tracker

> Update this file after every meaningful implementation change.

## Current Phase

Project Management feature — complete (per `tasks/001-project-module.md`)

## Current Goal

Ship the first core feature: Project CRUD + a reusable Project Workspace shell with placeholder resource tabs.

## Completed

- `Project` and `ProjectMember` Prisma models (archive via `status`/`archivedAt`; `deletedAt` exists in the schema but is unused dead weight as of the redesign below — see last bullet), added to `prisma/schema.prisma` and pushed to the database.
- `src/lib/permissions/project-access.ts` — per-project access resolution (org owner/moderator implicit admin, everyone else needs a `ProjectMember` row).
- `src/lib/zod-schema/project-schema.ts` — `projectSchema`, `projectMemberSchema`, `projectMemberRoleSchema`.
- API routes: `src/app/api/projects/route.ts` (list/create), `src/app/api/projects/[projectId]/route.ts` (get/update/archive/delete), `src/app/api/projects/[projectId]/members/route.ts` and `.../members/[memberId]/route.ts` (project member management).
- React Query hooks: `src/features/projects/utils/use-projects.ts`, `use-project-members.ts`.
- UI: `src/features/projects/components/` — projects list (card grid), create/edit dialog, actions menu (edit/archive/delete), Project Workspace shell + top nav, 9 placeholder tabs, Project Settings view with a Members section.
- All project dialogs (create/edit project, delete project, add project member) use `CustomModal` (`src/components/ui/custom-model.tsx`) rather than shadcn `Dialog`/`AlertDialog`, per `ui-context.md`'s "Use CustomModal for Dialog" rule and matching every existing production modal in the app (`add-workspace-modal.tsx`, `delete-workspace-modal.tsx`, `workspace-invite-modal.tsx`, etc.). Note: the codebase has two similarly named files — `custom-modal.tsx` (simple, only used by one image-editor component) and `custom-model.tsx` (typo'd filename, the one all real modals actually use, with mobile-drawer support) — we standardized on `custom-model.tsx`. The delete-project confirmation follows the `useDeleteWorkspaceModal`-style hook pattern (`src/features/projects/components/delete-project-modal.tsx` exports `useDeleteProjectModal`), shared between the project card's actions menu and the Settings page.
- Routes under `src/app/(app-root)/(privet)/(layout)/[workspace]/projects/**`, including `[projectId]/contexts|instructions|skills|prompt-templates|checklists|agent-profiles|approvals|mcp|activity|settings`.
- Fixed two latent bugs in the shared `PageShell` component (`src/components/layout/page-shell.tsx`), found via manual testing of the Projects list page: (1) its `isEmpty` branch never rendered `children`, so always-visible controls like a search bar would vanish whenever the result set was empty — now `children` renders in both the `isEmpty` and normal branches; (2) the header's `<time>` date element was `hidden` below the `sm` breakpoint — now always visible. Both fixes are no-ops for the other two `PageShell` consumers (Overview, Project Settings), which don't pass `isEmpty`.
- `projects-list-view.tsx` no longer passes `isLoading`/`isError`/`isEmpty` to `PageShell` at all — those props swap PageShell's *entire* page content (header included) for a skeleton/error/empty block, which caused the title, search bar, and status filter to disappear every time a debounced search re-triggered a fetch. Loading/error/empty states are now handled locally, scoped to just the results grid (`ProjectCardSkeleton` — new, `src/features/projects/components/project-card-skeleton.tsx`), so the header (with the always-visible date) and search/filter row stay mounted at all times. Also distinguishes "no projects match your search" from "no projects yet" (no misleading Create CTA while filtering) and debounces the search input via the existing `useDebounce` hook (`src/hooks/use-debounce.tsx`, 500ms, matching the Members table convention) instead of firing a request per keystroke. Project Settings (`project-settings-view.tsx`) still uses `PageShell`'s full-page `isLoading` — left as-is, out of scope for this fix.
- Added an optional `showDate` prop to `PageShell` (default `true`, so Overview is unaffected) and set `showDate={false}` on both Projects-module `PageShell` usages (`projects-list-view.tsx`, `project-settings-view.tsx`) — the header date is now hidden specifically on Project pages, per explicit request.
- **Fixed a real archive/unarchive bug**: `src/app/api/projects/[projectId]/route.ts`'s PATCH validation schema was `z.union([projectSchema.partial(), z.object({ status: ... })])`. Since `projectSchema.partial()` makes every field optional, it silently matched *any* body (stripping the unrecognized `status` key) as the first successful union branch, so `{ status: 'archived' }` requests always parsed to `{}` — the archive/unarchive code path never ran, and the request returned 200 with a success toast while doing nothing. Fixed by reordering the union so the specific `{ status }` schema is tried first.
- **Redesigned Delete/Archive semantics** (replacing the original soft-delete design, which had no recovery UI at all — see the abandoned "Trash" section in the plan file for context): Delete (`DELETE /api/projects/[projectId]`) is now a real, permanent `prisma.project.delete()` — no more soft delete via `deletedAt`. `ProjectMember` rows cascade-delete automatically. Archive is unchanged in the data model but now lives on its own page instead of a status filter on the main list: `/{workspace}/projects/archived` (`projects-archived-view.tsx`, `archived-project-card.tsx` — Restore/Delete buttons only, no dropdown menu, no Edit). The main Projects list (`projects-list-view.tsx`) no longer has a status filter — it's hardcoded to `status: 'active'`. Entry point to the Archived page is a top-level "Archived" item in the main sidebar (`src/utils/constants/route-list.ts` `pinnedNavItems`, url `/projects/archived`), not an in-page button — moved there after initial feedback that it belonged in the sidebar alongside "Projects," not inside the Projects page itself. `delete-project-modal.tsx` and `project-settings-view.tsx`'s delete-section copy updated to say "permanently delete... cannot be undone" instead of the old "can be reversed" wording. The `deletedAt` column stays in the schema, unused (dead but harmless — dropping it would be a destructive migration with no upside).
- Sidebar: added a "Projects" pinned nav item in `src/utils/constants/route-list.ts`.
- `context/ui-context.md`: updated the "Project Navigation" section to reflect the actual top-nav tabs (was previously a different/shorter list implying a sidebar-style nav) and clarified Project Settings is a separate gear icon, not a tab.
- `pnpm tsc --noEmit` passes with zero errors.

## In Progress

- None. Placeholder tabs (Contexts, Instructions, Skills, Prompt Templates, Checklists, Agent Profiles, Approvals, MCP, Activity) are stubs — their real functionality is future work per separate tasks.

## Next Up

- Implement the actual Contexts resource type (first real tab content).
- Consider whether project member management should also support inviting workspace members who haven't joined the org yet (currently: only existing org members can be granted project access).

## Open Questions

- None currently blocking.

## Architecture Decisions

| Decision | Reason |
|----------|--------|
| Projects are per-project ACL (`ProjectMember`), not just workspace-role-gated | User feedback: a project must be invisible to a workspace member until explicitly granted access, so workspace `member`/`viewer` roles alone aren't enough. |
| Org `owner`/`moderator` implicitly bypass `ProjectMember` and see all projects | Standard admin override — avoids needing to backfill `ProjectMember` rows for every project whenever an org admin needs access. |
| Project write authorization is enforced inline via `src/lib/permissions/project-access.ts`, not by extending Better Auth's access-control statements | Keeps `src/lib/permissions/workspace-permissions.ts` and `src/lib/auth/auth.ts` untouched, per the task's "do not rebuild auth" constraint. |
| Used `prisma db push` instead of `prisma migrate dev` for the new models | This project has no `prisma/migrations` history (schema was managed via `db push`); running `migrate dev` for the first time would have required a full database reset, which risks dropping existing data. `db push` applies the new tables additively without that risk. |
| Projects list is a card grid, not a data table | Matches the plan's chosen UX (Linear/Notion-style) for a small number of top-level entities that are primarily "click to open," vs. the dense row-based `MemberTable` pattern used for workspace members. |
| **(Supersedes the first row above)** Project management (create, settings, member management, and — once built — asset creation inside a project) is now gated on org-level `owner`/`moderator` only, not per-project delegated ownership | Explicit user requirement: "No one except the owner and moderator of the organization will be able to create projects... access settings... create assets." `canManageProject()` in `project-access.ts` now checks `isOrgAdmin` instead of `role === 'owner'`. `ProjectMember.role` `'owner'` is retired as an assignable value (Zod enums narrowed to `member`\|`viewer`); read-level `ProjectMember` access (a project is invisible until granted) is unchanged — this only tightens *management*, not visibility. **Important for future work**: when Contexts/Instructions/Skills/etc. get real CRUD (currently `PlaceholderTab` stubs), asset creation inside a project must also be gated on `isOrgAdmin`/`canManageProject`, per this same requirement — don't default to allowing any project member to create assets. |

## Session Notes

Implemented per the approved plan at the time this session ran. If resuming: the Project feature is functionally complete and type-checked, but has not been manually verified in a running dev server (no browser testing was performed in this session — see the plan's Verification section for the manual test checklist, including the access-control check with a second `member`-role workspace user).
