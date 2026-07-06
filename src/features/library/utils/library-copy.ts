export type LibrarySourceCategory =
  | 'instruction'
  | 'agent'
  | 'skill'
  | 'workflow'
  | 'cookbook'
  | 'plugin'
  | 'hook';

export type LibraryResourceType =
  | 'context'
  | 'instruction'
  | 'skill'
  | 'promptTemplate'
  | 'checklist';

export const CATEGORY_LABELS: Record<LibrarySourceCategory, string> = {
  instruction: 'Instruction',
  agent: 'Agent',
  skill: 'Skill',
  workflow: 'Workflow',
  cookbook: 'Cookbook',
  plugin: 'Plugin',
  hook: 'Hook'
};

export const RESOURCE_TYPE_OPTIONS: {
  value: LibraryResourceType;
  label: string;
}[] = [
  { value: 'context', label: 'Context' },
  { value: 'instruction', label: 'Instruction' },
  { value: 'skill', label: 'Skill' },
  { value: 'promptTemplate', label: 'Prompt Template' },
  { value: 'checklist', label: 'Checklist' }
];

export const RESOURCE_TYPE_LABELS: Record<LibraryResourceType, string> = {
  context: 'Context',
  instruction: 'Instruction',
  skill: 'Skill',
  promptTemplate: 'Prompt Template',
  checklist: 'Checklist'
};

// URL segment + React Query list-key prefix for each resource type — used to
// build the post-import redirect link and invalidate the right list query.
export const RESOURCE_TYPE_ROUTE_SEGMENT: Record<LibraryResourceType, string> =
  {
    context: 'contexts',
    instruction: 'instructions',
    skill: 'skills',
    promptTemplate: 'prompt-templates',
    checklist: 'checklists'
  };

export const RESOURCE_TYPE_QUERY_KEY: Record<LibraryResourceType, string> = {
  context: 'contexts',
  instruction: 'instructions',
  skill: 'skills',
  promptTemplate: 'prompt-templates',
  checklist: 'checklists'
};
