import { NavItem } from '@/types';

interface NavItems {
  label: string;
  items: NavItem[];
}

//Info: The following data is used for the sidebar navigation and Cmd K bar.

// Pinned items displayed at the top of the sidebar without a section label.
export const pinnedNavItems: NavItem[] = [
  {
    title: 'Overview',
    url: '/overview',
    icon: 'dashboard',
    isActive: false,
    isAdmin: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: 'layout',
    isActive: false,
    isAdmin: false,
    shortcut: ['p', 'p'],
    items: []
  },
  {
    title: 'Library',
    url: '/library',
    icon: 'library',
    isActive: false,
    isAdmin: false,
    shortcut: ['l', 'i'],
    items: []
  },
  {
    title: 'Archived',
    url: '/projects/archived',
    icon: 'restore',
    isActive: false,
    isAdmin: false,
    shortcut: ['a', 'a'],
    items: []
  },
  {
    title: 'MCP Users',
    url: '/mcp-users',
    icon: 'robot',
    isActive: false,
    isAdmin: false,
    shortcut: ['m', 'u'],
    items: []
  }
];

export const navItems: NavItems[] = [];

export const accountNavItems: NavItems[] = [
  {
    label: 'Account',
    items: [
      {
        title: 'General',
        url: '/account/settings',
        icon: 'settings',
        isActive: false,
        isAdmin: false,
        shortcut: ['g', 'g'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Security',
        url: '/account/settings/security',
        icon: 'security',
        isActive: false,
        isAdmin: false,
        shortcut: ['s', 's'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Sessions',
        url: '/account/settings/sessions',
        icon: 'key',
        isActive: false,
        isAdmin: false,
        shortcut: ['s', 's'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Integrations',
        url: '/account/settings/integrations',
        icon: 'spinner2',
        isActive: false,
        isAdmin: false,
        shortcut: ['i', 'i'],
        items: [] // Empty array as there are no child items for Dashboard
      }
    ]
  }
];

export const workspaceNavItems: NavItems[] = [
  {
    label: 'Workspace',
    items: [
      {
        title: 'General',
        url: '/settings',
        icon: 'settings',
        isActive: false,
        isAdmin: false,
        shortcut: ['g', 'g'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Billing',
        url: '/settings/billing',
        icon: 'billing',
        isActive: false,
        isAdmin: false,
        shortcut: ['b', 'b'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Members',
        url: '/settings/members',
        icon: 'users',
        isActive: false,
        isAdmin: false,
        shortcut: ['m', 'm'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Security',
        url: '/settings/security',
        icon: 'security',
        isActive: false,
        isAdmin: false,
        shortcut: ['s', 's'],
        items: [] // Empty array as there are no child items for Dashboard
      }
    ]
  }
];

export const systemAdminNavItems: NavItems[] = [
  {
    label: 'System Admin',
    items: [
      {
        title: 'Users',
        url: '/system-admin/users',
        icon: 'users',
        isActive: false,
        isAdmin: true,
        shortcut: ['su', 'su'],
        items: []
      },
      {
        title: 'Messages',
        url: '/system-admin/messages',
        icon: 'messageCircle',
        isActive: false,
        isAdmin: true,
        shortcut: ['sm', 'sm'],
        items: []
      }
    ]
  }
];
