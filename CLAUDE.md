## Session Start

Read these files before implementing anything:

1. `context/project-overview.md` — what you're building
2. `context/architecture.md` — stack, folders, invariants
3. `context/ui-context.md` — theme, colors, components
4. `context/code-standards.md` — rules and conventions
5. `context/env-reference.md` — environment variable names
6. `context/progress-tracker.md` — current state and next steps

## Key Rules

- New features go in `src/features/`. Shared logic goes in `src/lib/`.
- Do not modify `src/components/ui/` — those are managed by shadcn CLI.
- Run `pnpm tsc --noEmit` before marking any task done.
- Update `context/progress-tracker.md` after each meaningful change.
- If a change affects architecture, scope, or standards, update the relevant context file.
