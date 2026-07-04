# Task 002 — Resource Framework

## Goal

Build the reusable Resource Framework that will power every knowledge resource inside a Project.

This task does **not** implement Contexts, Instructions, Skills, Prompt Templates, Checklists, or Agent Profiles.

Instead, it creates the shared foundation so every future resource can reuse the same UI patterns, routing structure, components, and architecture.

This framework should become the standard for every resource feature.

---

# Read Before Starting

Read and follow:

- context/project-overview.md
- context/architecture.md
- context/ui-context.md
- context/code-standards.md
- context/ai-workflow-rules.md
- context/progress-tracker.md

---

# Background

Every resource inside ContextOS behaves almost the same.

Examples:

- Context
- Instruction
- Skill
- Prompt Template
- Checklist

They all support:

- Listing
- Search
- Filtering
- Creating
- Editing
- Viewing
- Deleting
- Future Versioning
- Future Approvals

The only difference between them is their purpose.

Therefore, the application should provide one reusable Resource Framework instead of implementing each feature independently.

---

# Objectives

Build reusable infrastructure that can later be used by every resource type.

Avoid feature-specific implementations.

Everything created in this task should be generic.

---

# Target Location

This framework is shared UI/logic, not a feature — future resource features (Contexts, Instructions, Skills, Prompt Templates, Checklists) will each live under their own `src/features/<name>/` folder, and `code-standards.md` forbids importing between sibling feature folders. So none of this framework goes in `src/features/`. Instead:

- Shared components → `src/components/resource/` (e.g. `resource-layout.tsx`, `resource-header.tsx`, `resource-list.tsx`, `empty-state.tsx`)
- Shared types → `src/types/`
- Shared hooks/utilities → `src/hooks/` / `src/lib/`

This framework replaces `PlaceholderTab` (`src/features/projects/components/placeholder-tab.tsx`) for the five in-scope routes only (Contexts, Instructions, Skills, Prompt Templates, Checklists). `PlaceholderTab` itself is untouched and stays in use for Agent Profiles, Approvals, MCP, and Activity, which are out of scope for this task.

Agent Profiles is excluded from this framework's Resource Types and Routing (unlike the other five, it composes existing resources into a profile rather than being its own flat list/search/CRUD surface) — it needs its own composition UI, not this framework.

---

# Deliverables

## 1. Resource Layout

Extend the existing `PageShell` (`src/components/layout/page-shell.tsx`) rather than building a new layout system from scratch — it already provides a configurable header (title/description/actions), loading skeleton, error+retry state, and empty state, and is already proven in `projects-list-view.tsx`. Add to it (or wrap it) whatever this task needs that it doesn't yet have — e.g. a view-toggle (card/table) slot and a bulk-actions slot — rather than duplicating its header/empty/loading logic in a parallel component.

The layout should include:

- Page Header
- Description
- Search
- Filter
- Sort
- Primary Action Button
- Resource List Area
- Empty State
- Loading State

This layout should receive configuration rather than hardcoded values.

Example configuration:

- title
- description
- create button label
- icon

---

## 2. Resource Navigation Support

Integrate the framework into the existing Project Workspace.

Every Project route such as:

- Contexts
- Instructions
- Skills
- Prompt Templates
- Checklists

should be able to reuse this framework.

No duplicated page structures.

---

## 3. Resource List Component

Create a reusable Resource List component.

The component must support:

- Card View
- Table View (future-ready)
- Search
- Empty State
- Loading State
- Pagination placeholder
- Bulk Action placeholder

Do not hardcode any resource type.

---

## 4. Resource Header Component

Create a reusable header component.

It should support:

- Icon
- Title
- Description
- Create Button
- Secondary Actions

Everything should be configurable, including a `canCreate` (or equivalent visibility) prop that hides the Create Button — future resource features must gate asset creation on `isOrgAdmin`/`canManageProject` the same way project creation is gated (see `progress-tracker.md`'s Architecture Decisions), and the header should support that without modification later.

---

## 5. Empty State Component

Reusable empty state.

Should support:

- Icon
- Title
- Description
- Primary Action

Example:

No Contexts

Create your first Context.

The same component should also work for:

- Instructions
- Skills
- Prompt Templates
- Checklists

without modification.

---

## 6. Loading Components

Create reusable loading skeletons.

Examples:

- List Skeleton
- Card Skeleton
- Header Skeleton

No page should render blank while loading.

---

## 7. Resource Types

Define a shared Resource Type.

The framework should support these resource types:

- Context
- Instruction
- Skill
- Prompt Template
- Checklist

Adding a new resource type in the future should require minimal code changes.

---

## 8. Routing

The framework must work inside:

Project

→ Contexts

→ Instructions

→ Skills

→ Prompt Templates

→ Checklists

Every route should use the same reusable layout.

---

# Out of Scope

Do NOT implement:

- CRUD
- Database
- API
- Rich Text Editor
- Versioning
- Approval Workflow
- Agent Profiles
- MCP
- Permissions

Only build the reusable UI and architecture.

---

# Architecture Requirements

Keep the framework modular.

Separate:

- Layout
- Components
- Types
- Hooks
- Utilities

Avoid duplicated code.

Design everything for reuse.

---

# UI Requirements

Follow:

- context/ui-context.md (including its "Layout Patterns" section)

Do not introduce a new design language.

Use existing shadcn/ui components whenever possible.

---

# Code Quality

Follow:

- context/code-standards.md

Keep components:

- Small
- Reusable
- Typed
- Maintainable

Avoid feature-specific naming.

Example:

Good

ResourceHeader

ResourceLayout

ResourceList

EmptyState

Bad

ContextHeader

ContextLayout

InstructionHeader

---

# Acceptance Criteria

This task is complete when:

- Every resource route shares the same layout.
- Resource pages can be configured without duplicating UI.
- Shared components are reusable.
- The framework is generic.
- No business logic has been implemented.
- Future resource modules can build on this framework without redesigning the UI.

---

# Before Completing

- Run `pnpm tsc --noEmit`
- Fix all TypeScript errors introduced by this task.
- Update `context/progress-tracker.md`, including its "Next Up" section: note that the Resource Framework was built before the Contexts feature (reordering the prior plan), and why (five near-identical resource features are coming, so building the shared framework once avoids five duplicated implementations).
- Update architecture documentation if required.

Return only production-ready code.