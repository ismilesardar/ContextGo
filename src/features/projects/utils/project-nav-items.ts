import type { Icons } from '@/components/icons';

export interface ProjectNavItem {
  title: string;
  segment: string;
  icon: keyof typeof Icons;
  /** Slug into src/features/help/content/help-articles.ts for this section's docs. */
  helpSlug: string;
}

export const PROJECT_NAV_ITEMS: ProjectNavItem[] = [
  {
    title: 'Contexts',
    segment: 'contexts',
    icon: 'fileText',
    helpSlug: 'contexts'
  },
  {
    title: 'Instructions',
    segment: 'instructions',
    icon: 'page',
    helpSlug: 'instructions'
  },
  { title: 'Skills', segment: 'skills', icon: 'star', helpSlug: 'skills' },
  {
    title: 'Prompt Templates',
    segment: 'prompt-templates',
    icon: 'messageCircle',
    helpSlug: 'prompt-templates'
  },
  {
    title: 'Checklists',
    segment: 'checklists',
    icon: 'clipboardX',
    helpSlug: 'checklists'
  },
  {
    title: 'Agent Profiles',
    segment: 'agent-profiles',
    icon: 'robot',
    helpSlug: 'agent-profiles'
  },
  {
    title: 'MCP',
    segment: 'mcp',
    icon: 'layout',
    helpSlug: 'mcp-and-ai-integrations'
  },
  {
    title: 'Activity',
    segment: 'activity',
    icon: 'dashboard',
    helpSlug: 'activity'
  }
];
