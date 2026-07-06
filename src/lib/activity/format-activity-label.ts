const VERB_PHRASES: Record<string, string> = {
  created: 'created',
  updated: 'updated',
  published: 'published',
  unpublished: 'unpublished',
  deleted: 'deleted',
  set_main: 'set the main version for',
  resources_updated: 'updated the resources for',
  archived: 'archived',
  unarchived: 'unarchived',
  added: 'added',
  role_changed: 'changed the role of',
  removed: 'removed',
  revoked: 'revoked',
  granted: 'granted access to',
  grant_updated: 'updated resource access for',
  removed_from_project: 'removed',
  imported_from_library: 'imported from the library'
};

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  context: 'Context',
  instruction: 'Instruction',
  skill: 'Skill',
  prompt_template: 'Prompt Template',
  checklist: 'Checklist',
  agent_profile: 'Agent Profile',
  project: 'the project',
  project_member: 'member',
  mcp_key: 'API key',
  mcp_identity: 'MCP User'
};

export const RESOURCE_DETAIL_SEGMENT: Record<string, string> = {
  context: 'contexts',
  instruction: 'instructions',
  skill: 'skills',
  prompt_template: 'prompt-templates',
  checklist: 'checklists',
  agent_profile: 'agent-profiles'
};

export function formatActivityLabel(activity: {
  action: string;
  resourceType: string | null;
}): string {
  const [, verb] = activity.action.split('.');
  const verbPhrase = VERB_PHRASES[verb] ?? verb;
  const resourceLabel = activity.resourceType
    ? (RESOURCE_TYPE_LABELS[activity.resourceType] ?? activity.resourceType)
    : '';
  return [verbPhrase, resourceLabel].filter(Boolean).join(' ');
}
