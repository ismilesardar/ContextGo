import { WorkspaceRole } from '@/lib/permissions/workspace-permissions';

export const PERMISSION_ACTIONS = [
  'workspaces.read',
  'workspaces.write',
  'tokens.read',
  'tokens.write',
  'billing.write',
  'billing.read'
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const ROLE_PERMISSIONS: {
  action: PermissionAction;
  description: string;
  roles: WorkspaceRole[];
}[] = [
  {
    action: 'workspaces.read',
    description: 'access workspaces',
    roles: ['owner', 'member', 'viewer', 'moderator']
  },
  {
    action: 'workspaces.write',
    description: 'manage workspace settings',
    roles: ['owner', 'moderator']
  },
  {
    action: 'billing.write',
    description: 'manage billing details',
    roles: ['owner']
  },
  {
    action: 'billing.read',
    description: 'access billing details',
    roles: ['owner', 'member', 'viewer', 'moderator']
  }
];

// Get permissions for a role
export const getPermissionsByRole = (role: WorkspaceRole) => {
  return ROLE_PERMISSIONS.filter(({ roles }) => roles.includes(role)).map(
    ({ action }) => action
  );
};
