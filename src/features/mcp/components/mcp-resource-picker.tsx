'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useContexts } from '@/features/contexts/utils/use-contexts';
import { useInstructions } from '@/features/instructions/utils/use-instructions';
import { useSkills } from '@/features/skills/utils/use-skills';
import { usePromptTemplates } from '@/features/prompt-templates/utils/use-prompt-templates';
import { useChecklists } from '@/features/checklists/utils/use-checklists';
import { useAgentProfiles } from '@/features/agent-profiles/utils/use-agent-profiles';
import type { ProjectApiKeyResourceType } from '../utils/use-project-api-keys';

export interface PickedResource {
  resourceType: ProjectApiKeyResourceType;
  resourceId: string;
}

interface PickableItem {
  id: string;
  title: string;
  status: string;
}

const SECTION_LABELS: Record<ProjectApiKeyResourceType, string> = {
  instruction: 'Instructions',
  skill: 'Skills',
  prompt_template: 'Prompt Templates',
  checklist: 'Checklists',
  context: 'Contexts',
  agent_profile: 'Agent Profiles'
};

const SECTION_ICONS: Record<ProjectApiKeyResourceType, keyof typeof Icons> = {
  instruction: 'page',
  skill: 'star',
  prompt_template: 'messageCircle',
  checklist: 'clipboardX',
  context: 'fileText',
  agent_profile: 'robot'
};

const SECTION_ORDER: ProjectApiKeyResourceType[] = [
  'agent_profile',
  'context',
  'instruction',
  'skill',
  'prompt_template',
  'checklist'
];

const SECTION_HINTS: Partial<Record<ProjectApiKeyResourceType, string>> = {
  agent_profile:
    'Granting a profile also grants everything it bundles, without ticking each item below.'
};

function ResourceSection({
  resourceType,
  items,
  isLoading,
  selected,
  onToggle
}: {
  resourceType: ProjectApiKeyResourceType;
  items: PickableItem[] | undefined;
  isLoading: boolean;
  selected: Set<string>;
  onToggle: (
    resourceType: ProjectApiKeyResourceType,
    resourceId: string
  ) => void;
}) {
  const Icon = Icons[SECTION_ICONS[resourceType]];
  const hint = SECTION_HINTS[resourceType];

  return (
    <div className='space-y-2'>
      <h4 className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase'>
        <Icon className='size-3.5' />
        {SECTION_LABELS[resourceType]}
      </h4>
      {hint && <p className='text-muted-foreground text-xs'>{hint}</p>}
      {isLoading ? (
        <p className='text-muted-foreground text-sm'>Loading…</p>
      ) : (items?.length ?? 0) === 0 ? (
        <p className='text-muted-foreground text-sm'>None created yet.</p>
      ) : (
        <div className='space-y-1'>
          {items?.map((item) => (
            <label
              key={item.id}
              className='hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm'
            >
              <Checkbox
                checked={selected.has(item.id)}
                onCheckedChange={() => onToggle(resourceType, item.id)}
              />
              <span className='min-w-0 flex-1 truncate'>{item.title}</span>
              <Badge
                variant={item.status === 'published' ? 'outline' : 'secondary'}
                className='shrink-0'
              >
                {item.status}
              </Badge>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function McpResourcePicker({
  projectId,
  value,
  onChange
}: {
  projectId: string;
  value: PickedResource[];
  onChange: (next: PickedResource[]) => void;
}) {
  const { data: contexts, isLoading: contextsLoading } = useContexts(projectId);
  const { data: instructions, isLoading: instructionsLoading } =
    useInstructions(projectId);
  const { data: skills, isLoading: skillsLoading } = useSkills(projectId);
  const { data: promptTemplates, isLoading: promptTemplatesLoading } =
    usePromptTemplates(projectId);
  const { data: checklists, isLoading: checklistsLoading } =
    useChecklists(projectId);
  const { data: agentProfiles, isLoading: agentProfilesLoading } =
    useAgentProfiles(projectId);

  const itemsByType: Record<
    ProjectApiKeyResourceType,
    { items: PickableItem[] | undefined; isLoading: boolean }
  > = {
    context: { items: contexts, isLoading: contextsLoading },
    instruction: { items: instructions, isLoading: instructionsLoading },
    skill: { items: skills, isLoading: skillsLoading },
    prompt_template: {
      items: promptTemplates,
      isLoading: promptTemplatesLoading
    },
    checklist: { items: checklists, isLoading: checklistsLoading },
    agent_profile: { items: agentProfiles, isLoading: agentProfilesLoading }
  };

  const titleLookup = new Map<string, string>();
  for (const type of SECTION_ORDER) {
    for (const item of itemsByType[type].items ?? []) {
      titleLookup.set(`${type}-${item.id}`, item.title);
    }
  }

  const selectedByType = new Map<ProjectApiKeyResourceType, Set<string>>();
  for (const ref of value) {
    const set = selectedByType.get(ref.resourceType) ?? new Set<string>();
    set.add(ref.resourceId);
    selectedByType.set(ref.resourceType, set);
  }

  function handleToggle(
    resourceType: ProjectApiKeyResourceType,
    resourceId: string
  ) {
    const isSelected = value.some(
      (ref) =>
        ref.resourceType === resourceType && ref.resourceId === resourceId
    );
    if (isSelected) {
      onChange(
        value.filter(
          (ref) =>
            !(
              ref.resourceType === resourceType && ref.resourceId === resourceId
            )
        )
      );
    } else {
      onChange([...value, { resourceType, resourceId }]);
    }
  }

  function handleSelectAll() {
    const all: PickedResource[] = [];
    for (const type of SECTION_ORDER) {
      for (const item of itemsByType[type].items ?? []) {
        all.push({ resourceType: type, resourceId: item.id });
      }
    }
    onChange(all);
  }

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-xs'>
            Only resources checked below will be visible through this key.
          </p>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleSelectAll}
          >
            Select all
          </Button>
        </div>
        {SECTION_ORDER.map((resourceType) => (
          <ResourceSection
            key={resourceType}
            resourceType={resourceType}
            items={itemsByType[resourceType].items}
            isLoading={itemsByType[resourceType].isLoading}
            selected={selectedByType.get(resourceType) ?? new Set()}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <div className='space-y-2'>
        <h4 className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
          Selected ({value.length})
        </h4>
        {value.length === 0 ? (
          <p className='text-muted-foreground text-sm'>
            No resources selected yet.
          </p>
        ) : (
          <div className='space-y-1'>
            {value.map((ref) => (
              <div
                key={`${ref.resourceType}-${ref.resourceId}`}
                className='flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-sm'
              >
                <span className='flex min-w-0 items-center gap-2'>
                  <Badge variant='secondary' className='shrink-0'>
                    {SECTION_LABELS[ref.resourceType]}
                  </Badge>
                  <span className='truncate'>
                    {titleLookup.get(`${ref.resourceType}-${ref.resourceId}`) ??
                      ref.resourceId}
                  </span>
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-6 shrink-0'
                  onClick={() => handleToggle(ref.resourceType, ref.resourceId)}
                >
                  <Icons.close className='size-3.5' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
