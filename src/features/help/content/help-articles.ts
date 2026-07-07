export interface HelpCategory {
  slug: string;
  title: string;
  description: string;
}

export interface HelpArticle {
  slug: string;
  categorySlug: string;
  title: string;
  summary: string;
  /** Markdown body, rendered with the shared `Markdown` component. */
  content: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'What Primiso is and how to set up your first project.'
  },
  {
    slug: 'resources',
    title: 'Resources',
    description: 'The six building blocks you use to capture project knowledge.'
  },
  {
    slug: 'collaboration',
    title: 'Collaboration & Governance',
    description: 'Versioning, roles, permissions, and project activity.'
  },
  {
    slug: 'library',
    title: 'Library',
    description: 'Importing ready-made templates instead of starting blank.'
  },
  {
    slug: 'ai-tools',
    title: 'Connecting AI Tools',
    description:
      'Exposing your published knowledge to Claude, ChatGPT, and more via MCP.'
  },
  {
    slug: 'account',
    title: 'Account & Billing',
    description: 'Managing your profile, security, and subscription.'
  }
];

export const HELP_ARTICLES: HelpArticle[] = [
  // ── Getting Started ──────────────────────────────────────────────
  {
    slug: 'what-is-primiso',
    categorySlug: 'getting-started',
    title: 'What is Primiso',
    summary:
      'The centralized knowledge layer that keeps every AI tool your team uses working from the same playbook.',
    content: `Primiso is a multi-tenant platform that acts as the centralized knowledge layer for organizations using AI. It lets you organize, govern, version, and distribute project-specific knowledge so that every AI tool your team relies on — Claude Code, ChatGPT, Cursor, GitHub Copilot, or whatever comes next — works from the same approved information and standards.

## The problem it solves

Without a shared source of truth, every person (and every AI assistant) ends up improvising: different naming conventions, different assumptions about architecture, different business rules. Primiso eliminates that drift by giving your organization one place to define "how we do things," and one place for AI tools to read it from.

## How it's organized

- **Organizations** are the top-level container — your company or team.
- Each organization has one or more **Projects**, and every project is a completely isolated workspace. Knowledge in one project never leaks into another.
- Inside a project, you create **Resources** — Contexts, Instructions, Skills, Prompt Templates, Checklists, and Agent Profiles — that capture your architecture, rules, and workflows.
- Org admins (owner/moderator) control what's **published**. Only published, approved content is ever served out to AI tools.

## The core flow

1. Sign in and create or join an organization.
2. Create a project — or open an existing one.
3. Enter the project workspace and start adding Resources.
4. Team members collaborate on those Resources according to their role.
5. An org admin publishes the versions that are ready to be the source of truth.
6. Any connected AI client retrieves that approved knowledge through the MCP server or API.

The result: every team member, and every AI tool they use, follows the same architecture, workflows, and business rules — without repeating the same explanation in every prompt.`
  },
  {
    slug: 'organizations-and-members',
    categorySlug: 'getting-started',
    title: 'Organizations & Members',
    summary:
      'Create your organization, invite your team, and understand the roles that control who can do what.',
    content: `An **Organization** is the top-level container in Primiso — everything else (projects, resources, billing) belongs to one. Most people only ever belong to one organization, but you can be a member of several.

## Roles

Every member of an organization has a role:

- **Owner** — full control, including billing and the ability to remove other admins.
- **Moderator** — an org admin in practice: can manage every project, publish resources, and manage members, but can't touch billing/ownership transfer.
- **Member** — regular contributor. Access to specific projects is controlled separately via project membership.
- **Viewer** — read-only.

Owners and moderators are collectively referred to as **org admins** throughout Primiso. They can act on any project in the organization without being explicitly added as a project member.

## Inviting people

From your organization settings you can invite teammates by email and assign their organization role. Once accepted, they show up in your member list and can be added to individual projects.

## Organization settings

Organization-level settings cover the org's name, members, and billing/subscription plan. Project-specific settings (like who's on a given project) live inside that project's own Settings, not here.`
  },
  {
    slug: 'projects',
    categorySlug: 'getting-started',
    title: 'Projects',
    summary:
      'Isolated workspaces where your team actually builds out Contexts, Instructions, Skills, and more.',
    content: `A **Project** is an isolated workspace inside your organization. Knowledge created in one project — Contexts, Instructions, Skills, Prompt Templates, Checklists, Agent Profiles — is never visible from another project.

## Creating a project

From the Projects list, click **Create Project** and give it a name and optional description. You immediately land in its workspace.

## The project workspace

Once inside a project, a top navigation bar gives you access to:

- **Contexts, Instructions, Skills, Prompt Templates, Checklists, Agent Profiles** — the six Resource types
- **MCP** — manage which AI identities can access this project's knowledge
- **Activity** — a timeline of everything that's happened in the project

Project **Settings** is separate from these tabs — it's the gear icon next to the project name in the workspace header, and covers the project's name/description and its member list.

## Archiving vs. deleting

- **Archiving** a project removes it from your active list but keeps everything intact — you can restore it any time from the **Archived** section in the sidebar.
- **Deleting** a project is permanent. It removes the project and all its resources immediately; there's no recovery step, so use Archive first if you're unsure.

## Project membership

Anyone with a **Project Member** row can access that project according to their project role. Org owners/moderators can access every project in the organization automatically, without needing an explicit membership row.`
  },

  // ── Resources ────────────────────────────────────────────────────
  {
    slug: 'contexts',
    categorySlug: 'resources',
    title: 'Contexts',
    summary:
      'Capture your architecture, business rules, and technical decisions as living documents.',
    content: `**Contexts** are where you document the "why" and "how" behind your project — architecture, business rules, technical decisions, and general project knowledge that both humans and AI tools need to stay aligned.

## What a Context is for

Think of Contexts as your project's shared understanding — the things a new engineer (or a new AI session) needs to read before touching the codebase: how the system is put together, why a particular technical decision was made, what a business rule actually means in practice. If it's background knowledge someone should *understand* rather than a rule they must *obey*, it belongs here.

Typical Contexts: "System Architecture," "Multi-tenant Data Model," "Why We Chose Postgres Over Mongo," "Billing & Subscription Rules."

## Creating a Context

1. Open a project and go to its **Contexts** tab.
2. Click **Create**.
3. Give it a **title** and an optional short **description** (shown on its card in the list).
4. Write the body in the built-in Markdown editor — headings, lists, code blocks, links, and bold/italic text are all supported through the toolbar.
5. Save. The Context is created as **v1**, in **draft** status.

## Finding a Context again

The Contexts tab is a searchable, filterable list: search by title, filter by draft/published status, and sort by most recently updated. Each card shows its status and current version number at a glance.

## Draft vs. published

A new Context starts as a **draft**. Drafts are visible to everyone with project access but are **never** served to connected AI tools. An org admin (owner/moderator) flips it to **published** — from the card's action menu or the detail page — once it's ready to be the source of truth. Publishing doesn't change the content, just its visibility to MCP/API consumers.

## Editing

Title/description and content are edited in two different places, on purpose, so quick metadata tweaks don't get mixed up with an in-progress rewrite of the actual document:

- **Title & description** — from the card's action menu on the list page, or the pencil icon next to the title on the detail page. Saves immediately.
- **Content** — open the Context and click **Edit**. This takes you to a dedicated content editor.

Every content save creates a **new version** snapshot — it does **not** automatically become what's live. You explicitly promote a version to **Main** when you're ready (see [Versioning & Publishing](/help/article/versioning-and-publishing) for the full mechanics). Until you do, the Context keeps serving whatever version is currently Main.

## Version history

From the detail page, open **Version history** to see every past version in a dropdown, preview any of them, set one as Main, or delete old versions you no longer need (you can't delete the current Main version, and a Context always keeps at least one version).

## Deleting

Deleting a Context is permanent and immediate — there's no archive step for individual resources the way there is for Projects. Make sure you actually mean to remove it, not just unpublish it.

## Who can write

Creating, editing, publishing, and deleting a Context requires org-admin-level project access (owner/moderator). Everyone with project access can read every Context, draft or published.

## Reusing a Context in an Agent Profile

Once published, a Context can be bundled into one or more [Agent Profiles](/help/article/agent-profiles) alongside Instructions, Skills, Prompt Templates, and Checklists — the same Context can belong to as many profiles as make sense.`
  },
  {
    slug: 'instructions',
    categorySlug: 'resources',
    title: 'Instructions',
    summary:
      'AI behavior rules, coding conventions, naming standards, and security requirements — in one place.',
    content: `**Instructions** capture the rules you want any AI tool (or new hire) to follow: AI behavior rules, coding conventions, naming standards, security requirements, documentation standards, and team workflows.

## What an Instruction is for

Instructions work exactly like Contexts structurally — a title, description, Markdown content, draft/published status, and full version history — but they're the resource type to reach for when what you're writing is a **rule to be followed**, rather than background knowledge to be understood.

- Use a **Context** for "here's how our system works."
- Use an **Instruction** for "here's what you must always/never do."

Typical Instructions: "Naming Conventions," "No Raw SQL Outside the Repository Layer," "Every PR Needs a Test," "How to Handle Secrets in Code."

## Creating an Instruction

1. Open a project and go to its **Instructions** tab.
2. Click **Create**, give it a title and optional description, and write the rule(s) in the Markdown editor. Numbered or bulleted lists work well for a set of related rules.
3. Save — it's created as v1, in **draft**.

Write Instructions the way you'd want an AI assistant to actually read them: direct, imperative language ("Always...", "Never...") reads more reliably than a paragraph explaining the reasoning — save the reasoning for a linked Context if it's worth capturing.

## Editing, versions, and publishing

Identical mechanics to Contexts: title/description edits are separate from content edits, every content save creates a new version rather than going live immediately, and an org admin explicitly sets a version as **Main** to publish it. See [Versioning & Publishing](/help/article/versioning-and-publishing) for the full walkthrough.

## Who can write

Creating, editing, publishing, and deleting an Instruction requires org-admin-level project access (owner/moderator). Everyone with project access can read every Instruction, draft or published.

## Connecting Instructions to AI tools

Once published and granted to an MCP connection, an Instruction is exactly the kind of resource an AI coding assistant benefits most from having on hand automatically — see [MCP & AI Integrations](/help/article/mcp-and-ai-integrations).`
  },
  {
    slug: 'skills',
    categorySlug: 'resources',
    title: 'Skills',
    summary:
      'Reusable workflows and standard operating procedures — deployment steps, review checklists as prose, and more.',
    content: `**Skills** document reusable workflows: standard operating procedures, development processes, code review procedures, deployment workflows, and step-by-step task execution guides.

## What a Skill is for

Structurally, a Skill is identical to a Context or Instruction — title, description, Markdown content, draft/published status, and version history. Think of it as the resource type for **"how we do this task, step by step,"** as opposed to a fact about the system (Context) or a rule to obey (Instruction).

Good candidates for a Skill: "How We Cut a Release," "How We Triage an Incoming Bug," "How to Onboard a New Service to the Deploy Pipeline," "How to Roll Back a Bad Deploy."

## Creating a Skill

1. Open a project and go to its **Skills** tab.
2. Click **Create**, add a title and description, and write the procedure as ordered steps in the Markdown editor — numbered lists map naturally onto a sequence of actions.
3. Save. It starts as v1, in **draft**, exactly like every other content-bearing resource.

A good Skill reads like a runbook: concrete steps, in order, with any decision points called out explicitly ("if X, do Y instead").

## Editing, versions, and publishing

Same model as every content-bearing resource type: title/description edits are separate from content edits, content edits create a new version rather than replacing what's live, and an org admin promotes a version to **Main** to publish it. Full details in [Versioning & Publishing](/help/article/versioning-and-publishing).

## Who can write

Creating, editing, publishing, and deleting a Skill requires org-admin-level project access (owner/moderator). Everyone with project access can read every Skill, draft or published.

## Bundling into an Agent Profile

A Skill is one of the five resource types you can pull into an [Agent Profile](/help/article/agent-profiles) — e.g. bundling your "How We Cut a Release" Skill into a "Release Manager" profile alongside relevant Checklists and Instructions.`
  },
  {
    slug: 'prompt-templates',
    categorySlug: 'resources',
    title: 'Prompt Templates',
    summary: 'A shared library of reusable prompts for common AI tasks.',
    content: `**Prompt Templates** are reusable prompts your team can pull from instead of re-writing the same instructions to an AI tool every time.

## What a Prompt Template is for

Like every other content-bearing resource, a Prompt Template has a title, description, Markdown body, draft/published status, and version history. Write the prompt itself as the content — including any placeholders or structure you want people to fill in — and publish it once it's proven useful.

Good candidates: a prompt for generating a PR description from a diff, a prompt for summarizing a customer support thread, a prompt for drafting release notes from a changelog.

## Creating a Prompt Template

1. Open a project and go to its **Prompt Templates** tab.
2. Click **Create**, give it a title and description that explains what the prompt is *for* (not the prompt text itself — that goes in the content).
3. Write the actual prompt in the Markdown editor. Use clearly marked placeholders (e.g. \`{{variable}}\` or \`[replace this]\`) for anything the person using it needs to fill in.
4. Save — created as v1, in **draft**.

## Editing, versions, and publishing

Same mechanics as every other content-bearing resource: title/description edits are separate from content edits, a content save creates a new version rather than replacing the live one, and an org admin sets a version as **Main** to publish it. See [Versioning & Publishing](/help/article/versioning-and-publishing).

## Who can write

Creating, editing, publishing, and deleting a Prompt Template requires org-admin-level project access (owner/moderator). Everyone with project access can read every Prompt Template, draft or published.

## Starting from the Library instead

Prompt Templates are one of the five resource types you can pull directly from the [Library](/help/article/library) instead of writing from scratch — browse, preview, and import a community-contributed prompt, then adjust it to fit your project.`
  },
  {
    slug: 'checklists',
    categorySlug: 'resources',
    title: 'Checklists',
    summary:
      'QA, release, security, and review checklists written as simple Markdown task lists.',
    content: `**Checklists** cover QA checklists, release checklists, security verification, deployment verification, and review checklists.

## What a Checklist is for

A Checklist uses the same Markdown content field as every other resource type — write your items as a standard GitHub-flavored Markdown task list:

\`\`\`
- [ ] Run the full test suite
- [ ] Confirm environment variables are set
- [ ] Notify the on-call engineer
\`\`\`

There's no separate structured "checklist item" data model — it's plain Markdown task-list syntax, which renders as checkboxes and is easy for both people and AI tools to parse. You can group items under headings (e.g. "Before you deploy" / "After you deploy") the same way you would in any other Markdown document.

## Creating a Checklist

1. Open a project and go to its **Checklists** tab.
2. Click **Create**, give it a title and description, and write your items as \`- [ ]\` lines (optionally grouped under \`##\` headings) in the Markdown editor.
3. Save — created as v1, in **draft**.

## Editing, versions, and publishing

Same model as every content-bearing resource: title/description edits are separate from content edits, a content save creates a new version rather than replacing the live one, and an org admin promotes a version to **Main** to publish it. See [Versioning & Publishing](/help/article/versioning-and-publishing).

## Who can write

Creating, editing, publishing, and deleting a Checklist requires org-admin-level project access (owner/moderator). Everyone with project access can read every Checklist, draft or published.

## Bundling into an Agent Profile

A Checklist can be bundled into an [Agent Profile](/help/article/agent-profiles) — for example, a "QA" profile that combines your test-plan Checklist with the relevant Instructions and Contexts a tester needs.`
  },
  {
    slug: 'agent-profiles',
    categorySlug: 'resources',
    title: 'Agent Profiles',
    summary:
      'Bundle Contexts, Instructions, Skills, and more into a single reusable AI role package.',
    content: `An **Agent Profile** is different from the other five resource types: it doesn't have its own long-form content or version history. Instead, it's a named bundle — a package of references to existing Contexts, Instructions, Skills, Prompt Templates, and Checklists that together define a role, like "Backend Developer," "QA," or "Marketing."

## What an Agent Profile is for

Instead of pointing an AI tool at five separate resources every time, you assemble them once into a profile that matches how your team actually thinks about roles: "everything a Backend Developer needs," "everything a new hire on the Marketing team needs," "everything the on-call engineer needs during an incident."

## Building a profile

1. Open a project and go to its **Agent Profiles** tab.
2. Click **Create**, and give it a title and description (e.g. "Backend Developer" / "Owns API and database work for this project").
3. Open the **resource picker**. It's organized into sections — Contexts, Instructions, Skills, Prompt Templates, Checklists — each listing that project's existing resources with a checkbox. Use **Select all** within a section if the whole category applies, or hand-pick individual items across sections.
4. A preview panel shows exactly what's currently selected before you save, so you can double-check the bundle reads correctly as a whole.
5. Save. Unlike the other five types, there's no draft content to publish — the profile itself doesn't have a status; what matters is that the *resources inside it* are published (see below).

## Editing a profile's resource list

Reopen the resource picker at any time to add or remove resources — it replaces the profile's full list in one save, rather than adding/removing one at a time.

## Why bundle resources instead of writing one big document

Individual resources stay reusable and independently versioned — a Skill used by the Backend Developer profile can also be reused, unchanged, in a Frontend Developer profile. The Agent Profile is just the assembled reading list for a given role; the underlying Contexts/Instructions/Skills/etc. are still edited and versioned exactly as described in their own articles.

## Publishing still matters per-resource

An Agent Profile bundles *references*. If a bundled Context or Instruction is still in draft, it won't be included when an AI tool fetches the profile through MCP — only resources that are both referenced by the profile **and** individually published are actually served. Publish each piece you want included, not just the profile.

## What happens if a bundled resource is deleted

If something referenced by a profile is later deleted, the profile shows a placeholder noting that resource is gone, instead of breaking. Re-saving the profile's resource picker will drop it from the bundle for good.

## Who can write

Creating, editing, and deleting an Agent Profile requires org-admin-level project access (owner/moderator). Everyone with project access can view a profile and preview what's bundled into it.

## Serving Agent Profiles to AI tools

Agent Profiles are one of the things an [MCP](/help/article/mcp-and-ai-integrations) connection can expose — an AI client can fetch a whole profile in one call and get every published resource bundled into it, instead of fetching each resource individually.`
  },

  // ── Collaboration & Governance ───────────────────────────────────
  {
    slug: 'versioning-and-publishing',
    categorySlug: 'collaboration',
    title: 'Versioning & Publishing',
    summary:
      'How draft/published status and the "Main version" pointer work together.',
    content: `Every content-bearing resource (Context, Instruction, Skill, Prompt Template, Checklist) has two related but separate ideas: **status** and **version history**.

## Draft vs. Published

A resource is either a **draft** (still being worked on, not visible to any AI tool) or **published** (approved and eligible to be served). Toggling this status doesn't touch the content itself.

## Version history — a "Main" pointer, not a linear stack

Every time you save an edit to a resource's content, a new **version** snapshot is created — but that edit does **not** automatically become "live." Nothing about the resource's current content changes just because you saved a draft edit.

Instead, each resource has one version flagged as **Main** — think of it like moving a git branch pointer rather than always reverting to the latest commit. To make an edit live:

1. Open the resource's version history.
2. Pick the version you want from the dropdown and preview it.
3. Click **Set as main version**.

Only then does that version's content become what the resource actually serves — both in the app and to any connected AI tool.

## Deleting old versions

You can delete old versions you no longer need, with two guardrails: you can never delete the current Main version (set a different one as Main first), and a resource must always keep at least one version.

## Why it works this way

This separates "I'm iterating on a draft" from "this is now the official version," so a half-finished edit can never accidentally become what your team or an AI tool relies on.`
  },
  {
    slug: 'roles-and-permissions',
    categorySlug: 'collaboration',
    title: 'Roles & Permissions',
    summary:
      'Who can read, who can write, and who administers — at the organization and project level.',
    content: `Primiso has two layers of roles: **organization roles** and **project roles**.

## Organization roles

- **Owner** / **Moderator** — org admins. They can manage every project in the organization, publish resources, and manage members — without needing to be explicitly added to a project.
- **Member** — access to projects is controlled by explicit project membership.
- **Viewer** — read-only across the organization.

## Project roles

Project membership grants access to a specific project's Resources. Read access (viewing Contexts, Instructions, Skills, etc.) is open to anyone with project access. **Writing** — creating, editing, publishing, or deleting a Resource — is reserved for org admins (owner/moderator) or an explicit project-manager-level role, rather than any project member by default.

## Why writes are gated to admins

Since published Resources become the source of truth an organization's AI tools rely on, Primiso deliberately keeps the "who can make something official" circle small and explicit, even though reading and discussing draft work is open to the whole project team.`
  },
  {
    slug: 'activity',
    categorySlug: 'collaboration',
    title: 'Activity',
    summary:
      "A project's activity timeline — every resource change, in one feed.",
    content: `The **Activity** tab in a project workspace is a chronological feed of everything that's happened in that project: resources created, edited, published, unpublished, or deleted; versions set as Main; members added, changed, or removed.

Each entry shows who did what, to which resource, and when. You can filter the feed by resource type, and it loads more as you scroll rather than paging through numbered pages — since this is a feed that only grows over time.

Activity is read-only and visible to anyone with access to the project — it's a shared record, not an admin-only audit log.`
  },

  // ── Library ───────────────────────────────────────────────────────
  {
    slug: 'library',
    categorySlug: 'library',
    title: 'Library',
    summary:
      'Browse and import community-contributed Instructions, Skills, and Prompt Templates instead of starting from a blank page.',
    content: `The **Library** is a global section (not tied to any one project) where you can browse community-contributed templates — synced from the public [github/awesome-copilot](https://github.com/github/awesome-copilot) repository — and import them straight into one of your projects instead of starting from a blank page.

## What's in it

Every Library template maps to one of the upstream repository's categories (instructions, agents, skills, workflows, cookbook recipes, plugins, hooks), and each one suggests which Primiso resource type it best fits as — a default you can always override at import time. Templates carry the tags, title, and description their author wrote, so you can tell what a template does before opening it.

## Browsing and searching

1. Open **Library** from the sidebar.
2. Use the search box to find templates by name or keyword, and the category filter to narrow the list down (e.g. only "instructions"-style templates).
3. Click a template to open its **preview** — the full content, rendered exactly like it will look once imported, plus its source category and tags.

Anyone in your organization can browse, search, and preview Library templates — no special permission needed just to look.

## Importing a template

There are two ways to bring a template into a project:

**From inside a project** — open any resource-type list (Contexts, Instructions, Skills, Prompt Templates, or Checklists) and click **Use template**. Since the project and target resource type are already known from where you clicked, picking a template imports it immediately and takes you straight to its edit page.

**From the global Library page** — browse and preview first, then click **Import**. Because neither the destination project nor resource type is known yet from this entry point, you'll be asked to choose both before the import runs.

Either way, importing requires the same access as creating any other resource: **org owner/moderator**. Agent Profiles aren't importable directly from the Library, since they're a bundle of other resources rather than standalone content — build those from resources already in your project instead.

## After importing

An imported template becomes a normal draft resource of whatever type you chose — same title/description/content fields, same version history, same publish step as if you'd written it yourself. It keeps a small attribution footer pointing back to its source template, and you're free to edit it immediately, exactly like any other resource.

## Staying up to date

The Library refreshes automatically on a daily schedule, so new or updated community templates show up without anyone needing to trigger anything manually.`
  },

  // ── Connecting AI Tools ───────────────────────────────────────────
  {
    slug: 'mcp-and-ai-integrations',
    categorySlug: 'ai-tools',
    title: 'MCP & AI Integrations',
    summary:
      'Give Claude, ChatGPT, Cursor, or any MCP-compatible client access to exactly the published knowledge you choose.',
    content: `Primiso exposes your organization's approved knowledge to external AI tools through the **Model Context Protocol (MCP)** — an open standard supported by Claude, Cursor, and a growing list of other AI clients.

## MCP Identities

An **MCP Identity** is a lightweight service-account concept, created once by an org owner/moderator at the organization level. It has a name, but no login of its own — it exists purely to represent "an AI tool that should be able to read our knowledge."

## Granting project access

An identity gains access to a project's knowledge by being **granted** into that project. From a project's **MCP** tab, an org admin adds an identity and picks exactly which Resources and Agent Profiles it can see. Access can be edited any time — updating an identity's grants updates every key issued for it instantly, with no need to reissue anything.

## Creating a key

Each identity can have one or more **API keys** — the actual bearer credential your AI client authenticates with. Keys are shown once at creation time; store them like any other secret.

## What the connected AI tool can actually see

An MCP client can only ever see Resources and Agent Profiles that are **both published and explicitly granted** to that identity in that project. Draft content, and anything not granted, is never exposed — regardless of what else exists in the project.

## Connecting a client

Point your MCP-compatible AI tool at Primiso's MCP endpoint for the project, authenticating with the API key you generated. From there it can list and fetch the granted resources and Agent Profiles directly — no more re-pasting your architecture docs into every new chat.`
  },

  // ── Account & Billing ─────────────────────────────────────────────
  {
    slug: 'account-settings',
    categorySlug: 'account',
    title: 'Account Settings',
    summary: 'Your profile, security options, and active sessions.',
    content: `Your personal **Account Settings** are separate from any organization or project — they follow you across every organization you belong to.

## Profile

Update your display name and avatar from the General account settings page.

## Security

From the Security tab you can:

- Change your password
- Enable **two-factor authentication (2FA)**
- Register a **passkey** for passwordless sign-in
- Review and revoke active sessions on other devices

## Sign-in methods

Primiso supports email/password sign-in as well as OAuth through Google and GitHub. You can use whichever method you originally signed up with, or add another from Security settings.`
  },
  {
    slug: 'billing-and-plans',
    categorySlug: 'account',
    title: 'Billing & Plans',
    summary: 'Subscription plans and how billing works per organization.',
    content: `Billing in Primiso is scoped **per organization**, not per user — every member of an organization shares the same plan.

## Managing your subscription

From your organization's Billing settings, you can view your current plan, upgrade or downgrade, and manage payment details. Subscriptions are billed on a recurring basis and can be changed at any time; plan changes take effect according to the billing provider's standard proration rules.

## Who can manage billing

Billing is restricted to organization **owners** — moderators can manage projects and members, but not the subscription itself.`
  }
];

export function getHelpArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): HelpArticle[] {
  return HELP_ARTICLES.filter(
    (article) => article.categorySlug === categorySlug
  );
}

export function getAdjacentArticles(slug: string): {
  previous: HelpArticle | null;
  next: HelpArticle | null;
} {
  const index = HELP_ARTICLES.findIndex((article) => article.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? HELP_ARTICLES[index - 1] : null,
    next: index < HELP_ARTICLES.length - 1 ? HELP_ARTICLES[index + 1] : null
  };
}
