Implement the first core feature of ContextGO: **Project Management**.

Before writing any code, read and follow:

- context/project-overview.md
- context/architecture.md
- context/ui-context.md
- context/code-standards.md
- context/env-reference.md
- context/ai-workflow-rules.md
- context/progress-tracker.md

The application foundation already exists.

Do NOT rebuild or modify:

- Authentication
- Organization management
- Existing layouts
- Sidebar
- Theme system
- shadcn/ui components

Your task is to implement the complete Project feature.

The Project feature should include:

- Projects list
- Create Project
- Edit Project
- Archive Project
- Soft Delete Project
- Project Settings
- Project Workspace

When a user opens a Project, navigate into the Project Workspace.

The Project Workspace must include a top navigation with the following routes:

- Contexts
- Instructions
- Skills
- Prompt Templates
- Checklists
- Agent Profiles
- Approvals
- MCP
- Activity

Create these routes as placeholder pages only. Their functionality will be implemented in future tasks.

The Project Workspace navigation must be reusable and become the standard layout for every Project.

Follow the existing architecture and coding standards.

Before finishing:

- Run `pnpm tsc --noEmit`
- Fix all TypeScript errors introduced by your changes.
- Update `context/progress-tracker.md` with completed work.
- If the implementation requires architectural changes, update the appropriate context files.

Do not implement future features.

Do not modify unrelated files.

Focus only on delivering a clean, production-ready Project feature.