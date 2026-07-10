import type { ProjectApiKeyResourceType } from './use-project-api-keys';

const RESOURCE_TYPE_LABELS: Record<ProjectApiKeyResourceType, string> = {
  context: 'Context',
  instruction: 'Instruction',
  skill: 'Skill',
  prompt_template: 'Prompt Template',
  checklist: 'Checklist',
  agent_profile: 'Agent Profile'
};

/**
 * Grant counts by type, e.g. { context: 3, instruction: 1 } — types with zero
 * grants are omitted so the generated doc only ever lists what this key can see.
 */
export function countGrantsByType(
  grants: { resourceType: ProjectApiKeyResourceType }[]
): Partial<Record<ProjectApiKeyResourceType, number>> {
  const counts: Partial<Record<ProjectApiKeyResourceType, number>> = {};
  for (const grant of grants) {
    counts[grant.resourceType] = (counts[grant.resourceType] ?? 0) + 1;
  }
  return counts;
}

/**
 * Markdown instructions meant to be dropped at the root of a consuming project
 * (alongside CLAUDE.md, AGENTS.md, etc.) so a coding agent knows this project's
 * knowledge lives behind the Primiso MCP tools rather than in local files, and
 * reaches for them instead of inferring answers by scanning the repo.
 */
export function buildConnectionInstructionsMd({
  identityName,
  grantCounts
}: {
  identityName: string;
  grantCounts: Partial<Record<ProjectApiKeyResourceType, number>>;
}): string {
  const contentTypes = (
    Object.keys(grantCounts) as ProjectApiKeyResourceType[]
  ).filter((type) => type !== 'agent_profile');
  const hasAgentProfiles = (grantCounts.agent_profile ?? 0) > 0;

  const accessLines = (
    Object.entries(grantCounts) as [ProjectApiKeyResourceType, number][]
  ).map(
    ([type, count]) =>
      `- ${count} ${RESOURCE_TYPE_LABELS[type]}${count === 1 ? '' : 's'}`
  );

  return `# Primiso MCP — Connection Instructions

This project is connected to Primiso ("${identityName}"), which holds this
project's approved architecture, business rules, conventions, and workflows.
**Prefer Primiso's MCP tools over guessing from local files** when you need
this kind of project knowledge — the repo's contents may be incomplete, out
of date, or simply not where this information lives.

## Available tools

${contentTypes.length > 0 ? `- \`list_resources\` — list published resources this key can see, optionally filtered by \`resourceType\` (${contentTypes.join(', ')}).\n- \`get_resource\` — fetch one resource by \`resourceType\` + \`slug\`.\n` : ''}${hasAgentProfiles ? `- \`list_agent_profiles\` — list published Agent Profiles this key is granted.\n- \`get_agent_profile\` — fetch an Agent Profile's bundled resources by \`slug\`.\n` : ''}
## What this key can access

${accessLines.length > 0 ? accessLines.join('\n') : '- Nothing yet — grant this MCP User access to resources in Primiso.'}

## When to reach for these tools

- Before answering "what's our standard/convention for X" — call \`list_resources\`
  (or \`get_resource\` if you already know the slug) instead of inferring a
  convention from whatever code happens to be nearby.
- Before explaining "how does this project work" / "what's the architecture" —
  check Primiso's Contexts first.
- Before following a multi-step process (release, review, deployment) — check
  Primiso's Skills and Checklists first.
- If Primiso has no matching resource, fall back to reading the local repo as
  usual.
`;
}
