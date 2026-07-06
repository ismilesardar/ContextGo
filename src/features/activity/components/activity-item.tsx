'use client';

import Link from 'next/link';
import type { ProjectActivity } from '../utils/use-project-activities';

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
  removed_from_project: 'removed'
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

const RESOURCE_DETAIL_SEGMENT: Record<string, string> = {
  context: 'contexts',
  instruction: 'instructions',
  skill: 'skills',
  prompt_template: 'prompt-templates',
  checklist: 'checklists',
  agent_profile: 'agent-profiles'
};

function formatActivityLabel(activity: ProjectActivity): string {
  const [, verb] = activity.action.split('.');
  const verbPhrase = VERB_PHRASES[verb] ?? verb;
  const resourceLabel = activity.resourceType
    ? (RESOURCE_TYPE_LABELS[activity.resourceType] ?? activity.resourceType)
    : '';
  return [verbPhrase, resourceLabel].filter(Boolean).join(' ');
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function ActivityItem({
  activity,
  workspaceSlug,
  projectId
}: {
  activity: ProjectActivity;
  workspaceSlug: string;
  projectId: string;
}) {
  const label = formatActivityLabel(activity);
  const segment = activity.resourceType
    ? RESOURCE_DETAIL_SEGMENT[activity.resourceType]
    : undefined;
  const href =
    segment && activity.resourceId
      ? `/${workspaceSlug}/projects/${projectId}/${segment}/${activity.resourceId}`
      : undefined;

  return (
    <div className='flex items-start justify-between gap-4 border-b px-4 py-3 last:border-b-0'>
      <p className='min-w-0 text-sm'>
        <span className='font-medium'>{activity.actorName}</span>{' '}
        <span className='text-muted-foreground'>{label}</span>{' '}
        {activity.resourceTitle &&
          (href ? (
            <Link href={href} className='font-medium hover:underline'>
              "{activity.resourceTitle}"
            </Link>
          ) : (
            <span className='font-medium'>"{activity.resourceTitle}"</span>
          ))}
      </p>
      <span className='text-muted-foreground shrink-0 text-xs'>
        {formatTime(activity.createdAt)}
      </span>
    </div>
  );
}
