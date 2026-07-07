# Task 004 — Context Feature

## Goal

Implement the complete Context feature inside project for Primiso.

This is the first real Resource implementation and will become the reference architecture for all future resource types:

- Instructions
- Skills
- Prompt Templates
- Checklists

The Context module must be production-ready and reusable.

Future resource modules should follow the same implementation pattern.

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

A Context stores long-term project knowledge.

Contexts answer:

> What should humans and AI know about this project?

Examples:

- Frontend Architecture
- Backend Architecture
- Database Standards
- Security Standards
- API Design Rules
- Business Rules
- Project Vision
- Coding Guidelines
- Infrastructure Decisions

Contexts are one of the most important assets inside a Project.

---

# User Flow

Project

→ Contexts

→ Create Context

→ Edit Context

→ Publish Context

→ View Context

→ Use Context inside AI workflows

---

# Context Entity

Create a Context model.

Fields:

- id
- projectId
- title
- slug
- description
- content
- status
- version
- createdBy
- updatedBy
- createdAt
- updatedAt

---

# Status

Support:

- Draft
- Published

Default:

Draft

---

# Context List Page

Route:

```text
/projects/[projectSlug]/contexts
```

Create a production-ready Contexts page.

Features:

- Page Header
- Description
- Search
- Filter
- Sort
- Create Context button

Display Contexts as cards.

Each card shows:

- Title
- Description
- Status
- Version
- Updated At
- Author

Actions:

- Open
- Edit
- Delete

---

# Create Context

Route:

```text
/projects/[projectSlug]/contexts/new
```

Create a Context creation page.

Fields:

- Title
- Description
- Content

Requirements:

- Title required
- Description optional
- Content required

Automatically generate:

- slug

Validation:

- Zod
- React Hook Form

Use server actions if supported by architecture.

---

# Edit Context

Route:

```text
/projects/[projectSlug]/contexts/[contextId]/edit
```

Allow editing:

- Title
- Description
- Content

Save changes.

Update timestamps.

---

# Context Detail Page

Route:

```text
/projects/[projectSlug]/contexts/[contextId]
```

Create a detailed Context page.

Layout:

Header

- Title
- Status
- Version
- Actions

Content Area

- Render content

Metadata Sidebar

- Author
- Created Date
- Updated Date
- Status

Actions

- Edit
- Publish
- Delete

---

# Rich Text Editor

Use the editor architecture defined by the project.

Requirements:

- Headings
- Paragraphs
- Lists
- Code Blocks
- Links
- Quotes

Must support large Context documents.

The editor should be reusable by future resources.

Do not create a Context-specific editor.

---

# Search

Support Context search.

Search fields:

- title
- description

Search should be project-scoped.

Never return Contexts from another Project.

---

# Project Isolation

Critical requirement.

Every Context belongs to exactly one Project.

A Context from Project A must never appear inside Project B.

Enforce isolation:

- Database
- Queries
- UI
- Routes

---

# Empty State

When no Contexts exist:

Display:

Icon

Title

Description

Primary CTA

Example:

No Contexts yet

Create your first Context to document important project knowledge.

[ Create Context ]

---

# Loading States

Create:

- Context Card Skeleton
- Context List Skeleton
- Context Detail Skeleton

Never show blank screens.

---

# Delete Context

Allow deletion.

Use confirmation dialog.

For MVP:

Soft delete preferred.

If project architecture does not yet support soft deletes, design the implementation so soft delete can be added later.

---

# Publish Context

Support publishing.

Workflow:

Draft

↓

Published

Users should be able to publish a Context.

Versioning will be added later.

For now:

Published Contexts become available to future AI integrations.

---

# Permissions

Prepare architecture for permissions.

For MVP:

Assume authenticated project members can access Contexts.

Do not implement full permission management yet.

---

# Reusability Requirement

This implementation will become the blueprint for:

- Instructions
- Skills
- Prompt Templates
- Checklists

Avoid Context-specific architecture.

Create reusable:

- Forms
- Layouts
- Editor integration
- Detail pages
- List pages

Future resource modules should require minimal additional code.

---

# UI Requirements

Strictly follow:

- context/ui-context.md
- context/layout-patterns.md
- context/component-rules.md

Use existing shadcn/ui components.

Do not introduce a different design language.

---

# Code Quality

Strictly follow:

- context/code-standards.md

Requirements:

- Fully typed
- Modular
- Reusable
- Production-ready

Separate:

- UI
- Validation
- Server Actions
- Database Access
- Types

Avoid duplicated code.

---

# Out of Scope

Do NOT implement:

- Instructions
- Skills
- Prompt Templates
- Checklists
- Agent Profiles
- Approval Workflow
- MCP Integration
- AI Chat
- AI Context Suggestions

These will be implemented in future tasks.

---

# Acceptance Criteria

This task is complete when:

- Users can create Contexts.
- Users can edit Contexts.
- Users can delete Contexts.
- Users can publish Contexts.
- Users can browse Contexts.
- Users can search Contexts.
- Contexts are isolated by Project.
- The implementation is reusable for future resource types.
- TypeScript passes without errors.

---

# Before Completing

- Run `pnpm tsc --noEmit`
- Fix all TypeScript errors
- Update `context/progress-tracker.md`
- Update architecture documentation if needed

Return only production-ready code.