// hooks/use-permissions.ts
import { rolePermissionsMap } from '@/lib/permissions/workspace-permissions';
import { useWorkspaceStore } from '@/store';

export const usePermissions = () => {
  const { activeMember } = useWorkspaceStore((state) => state);
  const role = activeMember?.role as keyof typeof rolePermissionsMap;

  const hasPermission = (
    resource: keyof (typeof rolePermissionsMap)['owner']['statements'],
    action: 'create' | 'update' | 'delete' | 'read'
  ) => {
    if (!role || !rolePermissionsMap[role]) return false;

    // Check if the permission exists in your map
    const roleConfig = rolePermissionsMap[role] as any;
    const permissions =
      role === 'owner'
        ? roleConfig?.statements?.[resource]
        : roleConfig?.[resource];

    return Array.isArray(permissions) && permissions.includes(action);
  };

  return { hasPermission, role };
};
