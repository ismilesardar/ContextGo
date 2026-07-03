# UI Context

## Theme

ContextOS follows a modern enterprise SaaS design system optimized for productivity rather than decoration.

The interface should feel similar to Linear, GitHub, Notion, and the Vercel Dashboard.

Design principles:

- Desktop-first responsive application.
- Clean layouts with generous whitespace.
- Low visual noise.
- Flat design with subtle elevation.
- Consistent spacing using an 8px spacing system.
- Cards are used only when grouping related information.
- Avoid unnecessary gradients, glassmorphism, shadows, or excessive animations.
- Every page should prioritize readability and speed.
- The interface should make users feel like they are working inside an operating system for organizational knowledge.

Dark mode and light mode are both fully supported using the existing design token system.

---

# Color Tokens

The application already uses a complete OKLCH design token system.

Never hardcode colors.

Always use semantic Tailwind classes or CSS variables.

| Role | CSS Variable | Existing Token |
|------|-------------|----------------|
| Page background | `--background` | Primary application background |
| Surface | `--card` | Cards, panels, editors |
| Popover | `--popover` | Dropdowns, dialogs |
| Primary text | `--foreground` | Main text |
| Secondary text | `--muted-foreground` | Helper text |
| Primary action | `--primary` | Buttons, active state |
| Accent | `--accent` | Hover surface |
| Border | `--border` | Borders & separators |
| Input | `--input` | Inputs |
| Focus Ring | `--ring` | Keyboard focus |
| Success | `--success` | Success badges |
| Warning | `--warning` | Warning states |
| Info | `--info` | Informational states |
| Error | `--destructive` | Error states |
| Sidebar | `--sidebar` | Sidebar background |
| Sidebar Active | `--sidebar-primary` | Active navigation |

Preferred Tailwind utilities:

```
bg-background
bg-card
bg-popover

text-foreground
text-muted-foreground

border-border

bg-primary
text-primary-foreground

bg-accent
text-accent-foreground
```

Never use raw hex colors inside components.

---

# Typography

| Role | Font | Variable |
|------|------|----------|
| UI | Geist Sans | `--font-sans` |
| Code | Geist Mono | `--font-mono` |

Typography rules:

- Page title → text-3xl font-semibold
- Section title → text-xl font-semibold
- Card title → text-base font-medium
- Body → text-sm
- Description → text-sm text-muted-foreground
- Labels → text-sm font-medium
- Small metadata → text-xs text-muted-foreground

Avoid oversized typography.

---

# Border Radius

Use the existing radius tokens.

| Context | Class |
|---------|-------|
| Small controls | `rounded-sm` |
| Inputs | `rounded-md` |
| Cards | `rounded-lg` |
| Dialogs | `rounded-xl` |
| Buttons | `rounded-md` |

Never introduce custom radius values.

---

# Shadows

Use shadows sparingly.

Allowed:

- shadow-sm
- shadow

Avoid:

- heavy shadows
- floating cards everywhere
- neumorphism
- glassmorphism

---

# Spacing

Use an 8px spacing system.

Common spacing:

- Page padding → p-6
- Card padding → p-6
- Section gap → gap-6
- Form spacing → gap-4
- Inline spacing → gap-2

Pages should breathe.

---

# Component Library

Use shadcn/ui for every standard component.

Never recreate components that already exist.

Components live in:

```
src/components/ui/
```

Install components only through:

```
pnpm dlx shadcn@latest add <component>
```

Use:

- class-variance-authority
- cn()
- Tailwind variants

Avoid inline styles.

---

# Icons

Primary:

- Lucide React

Secondary:

- Tabler Icons

Fallback:

- Radix Icons

Sizes:

Inline:

```
h-4 w-4
```

Buttons:

```
h-5 w-5
```

Never mix icon styles on the same page.

---

# Layout Patterns

Application layout:

```
Sidebar
    ↓
Project Workspace
        ↓
Top Navigation
            ↓
Content
```

The application has two navigation levels.

Global Sidebar:

- Overview
- Projects
- Marketplace
- Organization Settings

Project Navigation (horizontal top nav inside the content area, not the sidebar):

- Contexts
- Instructions
- Skills
- Prompt Templates
- Checklists
- Agent Profiles
- Approvals
- MCP
- Activity

Project Settings is not one of the tabs above — it's a separate gear icon in the Project Workspace header, next to the project name.

Use:

- Fixed sidebar
- Sticky top navigation
- Scrollable content
- Responsive layout

---

# Tables

Use:

@tanstack/react-table

Requirements:

- sorting
- filtering
- pagination
- row selection
- bulk actions

Tables should always support empty states.

---

# Forms

Use:

- React Hook Form
- Zod

Validation errors should appear below inputs.

Required fields should be clearly indicated.

---

# Dialogs

Use 'CustomModal' for Dialog. Inside '/components/ui/custom-modal'

Rules:

- Maximum width: lg or xl
- Escape closes dialog
- Clicking outside closes only when safe
- Primary action aligned right

---

# Select

Use 'CustomPopover' for Dialog. Inside '/components/ui/custom-popover'

---

# Notifications

Use Sonner.

Success:

```
toast.success()
```

Error:

```
toast.error()
```

Info:

```
toast()
```

Never use alert().

---

# Animations

Animations should be subtle.

Allowed:

- fade
- slide
- accordion
- dialog transition

Duration:

150–250ms

Avoid:

- bouncing
- spinning
- excessive movement

---

# Empty States

Every page must provide:

- icon
- title
- description
- primary action

Example:

"No Contexts yet"

Create your first Context to define your project's architecture.

[ Create Context ]

---

# Loading States

Always use Skeleton components.

Never leave blank pages.

---

# Design Philosophy

Every screen should answer three questions immediately:

1. Where am I?
2. What can I do here?
3. What should I do next?

The UI should always feel predictable, fast, and professional.

When unsure between a beautiful design and a clear design, always choose clarity.

The goal of ContextOS is to become an operating system for organizational AI knowledge—not a visually flashy application.