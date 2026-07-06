import type { Icons } from '@/components/icons';

export interface ProjectNavItem {
  title: string;
  segment: string;
  icon: keyof typeof Icons;
}

export const PROJECT_NAV_ITEMS: ProjectNavItem[] = [
  { title: 'Contexts', segment: 'contexts', icon: 'fileText' },
  { title: 'Instructions', segment: 'instructions', icon: 'page' },
  { title: 'Skills', segment: 'skills', icon: 'star' },
  {
    title: 'Prompt Templates',
    segment: 'prompt-templates',
    icon: 'messageCircle'
  },
  { title: 'Checklists', segment: 'checklists', icon: 'clipboardX' },
  { title: 'Agent Profiles', segment: 'agent-profiles', icon: 'robot' },
  { title: 'MCP', segment: 'mcp', icon: 'layout' },
  { title: 'Activity', segment: 'activity', icon: 'dashboard' }
];
