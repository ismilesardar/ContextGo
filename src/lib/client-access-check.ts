import { combineWords } from '@/utils/functions/combine-words';
import { WorkspaceRole } from './permissions/workspace-permissions';
import { PermissionAction, ROLE_PERMISSIONS } from './api/rbac/permissions';

export const clientAccessCheck = ({
  action,
  role,
  customPermissionDescription
}: {
  action: PermissionAction;
  role: WorkspaceRole;
  customPermissionDescription?: string;
}) => {
  // const activeMember = useWorkspaceStore((state) => state.activeMember);
  // const role = activeMember?.role as keyof typeof rolePermissionsMap;

  const permission = ROLE_PERMISSIONS.find((p) => p.action === action)!;
  const allowedWorkspaceRoles = permission.roles;
  const allowed = allowedWorkspaceRoles.includes(role);

  if (allowed) {
    return {
      allowed,
      error: false
    };
  }

  return {
    allowed,
    error: `Only workspace ${combineWords(allowedWorkspaceRoles.map((r) => `${r}s`))} can ${customPermissionDescription || permission.description}.`
  };
};
