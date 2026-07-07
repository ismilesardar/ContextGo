# Project Overview

> Fill this file before starting implementation on a new project.

## What

Primiso is a multi-tenant SaaS platform that acts as the centralized knowledge layer for organizations using AI. It enables companies to organize, govern, version, and distribute project-specific knowledge so that every AI tool (such as Claude Code, ChatGPT, Cursor, GitHub Copilot, or future AI platforms) can work using the same approved information and company standards. Each organization contains multiple isolated projects, and each project maintains its own independent knowledge resources. The platform is designed to eliminate inconsistent AI outputs, reduce onboarding time, preserve organizational knowledge, and ensure every team member and AI assistant follows the same architecture, workflows, and business rules.

## Goals

1. Build a centralized knowledge management platform for AI-first organizations.
2. Ensure every project maintains completely isolated knowledge and permissions.
3. Allow organizations to manage reusable Contexts, Instructions, Skills, Prompt Templates, Checklists, and Agent Profiles.
4. Provide version control so only knowledge an org admin has explicitly published is used by AI.
5. Expose project knowledge through an MCP server and API so any supported AI client can consume it.
6. Reduce repetitive prompting by allowing organizations to create reusable AI knowledge packages.
7. Support teams of different roles (Engineering, Product, Marketing, HR, Operations, etc.) using the same platform.
8. Design a scalable architecture that allows new resource types to be added without major system redesign.

## Core User Flow

1. User signs in to ContextOS.
2. User creates or joins an Organization.
3. User creates or opens an existing Project.
4. User enters the selected Project Workspace.
5. User creates project-specific Resources such as Contexts, Instructions, Skills, Prompt Templates, Checklists, and Agent Profiles.
6. Team members collaborate on Resources according to their permissions.
7. Org admins publish approved versions directly — no separate review/approval step exists.
8. AI clients retrieve approved project knowledge through MCP or API.
9. Team members use any supported AI tool while automatically following the organization's approved standards.
10. Project knowledge continuously evolves through versioning and collaboration.

## Features

### Organization Management
- Multi-tenant organization architecture
- Organization dashboard
- Organization settings
- Member management
- Role-based access control
- Organization-level permissions

### Project Management
- Create, edit, archive, and delete projects
- Project dashboard
- Project settings
- Project member management
- Completely isolated project workspaces
- Project-specific permissions

### Resource Management
- Create, edit, archive, and delete Resources
- Resource categorization
- Rich text editor
- Markdown support
- Search and filtering
- Tags (future-ready)
- Resource relationships
- Resource metadata

### Contexts
- Architecture documentation
- Business rules
- Technical decisions
- Development standards
- Project knowledge
- Version history

### Instructions
- AI behavior rules
- Coding conventions
- Naming standards
- Security requirements
- Documentation standards
- Team workflows

### Skills
- Reusable workflows
- Standard operating procedures
- Development processes
- Code review procedures
- Deployment workflows
- Task execution guides

### Prompt Templates
- Reusable prompts
- Prompt categories
- Team prompt library
- AI task templates

### Checklists
- QA checklists
- Release checklists
- Security verification
- Deployment verification
- Review checklists

### Agent Profiles
- Create reusable AI role profiles
- Combine multiple Resources into a single profile
- Backend Developer profiles
- Frontend Developer profiles
- QA profiles
- Product Manager profiles
- Marketing profiles
- Preview included Resources

### Version Control
- Draft resources
- Published resources
- Version history
- Resource comparison
- Rollback support
- Change tracking

### Approval Workflow
**Removed from scope.** Org admins (owner/moderator) already fully control draft/publish status and the Main-version pointer directly on every resource type — there is no distinct "submitter" role to review, so a separate approve/reject step added no value. Publishing is a direct org-admin action, not a two-party workflow.

### Permissions
- Organization roles
- Project roles
- Resource permissions
- Read permissions
- Edit permissions
- Admin controls

### Activity
- Project activity timeline
- Resource updates
- Member activity
- Audit events

### MCP & API
- MCP server
- Secure authentication
- Resource retrieval
- Agent Profile loading
- Context package generation
- External AI integration
- API endpoints
- Future SDK support

### Search
- Global project search
- Resource search
- Full-text search
- Filter by resource type
- Fast navigation

### Library
- Browse and import community-contributed Instructions, Skills, Prompt Templates, and more, synced from github/awesome-copilot
- Search and filter by category
- Preview before importing
- Import directly into a project as any of the 5 content-bearing Resource types
- Global section, open to any authenticated user to browse; importing requires org owner/moderator

## Scope

**In:**
- Multi-tenant SaaS architecture
- Organizations
- Projects
- Project workspaces
- Contexts
- Instructions
- Skills
- Prompt Templates
- Checklists
- Agent Profiles
- Library (community template import)
- Version control
- Role-based permissions
- Project activity
- MCP server
- Public API
- Rich text editing
- Search
- Responsive desktop-first UI

**Out:**
- AI model training
- Custom LLM hosting
- AI inference
- Chat interface
- Document storage and AI extraction (planned for a future release)
- Billing and subscriptions
- Mobile application
- Real-time collaborative editing
- External integrations (Slack, Notion, Google Drive, GitHub) during MVP

## Success Criteria

1. Organizations can create multiple isolated projects.
2. Knowledge from one project can never be accessed by another project unless explicitly supported in the future.
3. Users can manage Contexts, Instructions, Skills, Prompt Templates, Checklists, and Agent Profiles within a project.
4. Every Resource supports versioning, with publication controlled directly by org admins.
5. Role-based permissions correctly restrict project and resource access.
6. Agent Profiles successfully assemble approved Resources into reusable AI context packages.
7. MCP and API endpoints can securely expose approved project knowledge.
8. The system is modular enough to support new Resource types without major architectural changes.
9. The UI remains intuitive for both technical and non-technical teams.
10. The platform becomes the single source of truth for organizational AI knowledge across all supported AI tools.