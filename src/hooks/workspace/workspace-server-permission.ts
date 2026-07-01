import { auth } from '@/lib/auth/auth';
import { rolePermissionsMap } from '@/lib/permissions/workspace-permissions';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export async function getServerPermissions() {
  const cookieStore = await cookies();
  const activeMemberCookie = cookieStore.get('active_member');

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.session.activeOrganizationId) {
    return { hasPermission: () => false, role: null };
  }

  // 2. Parse the member data safely
  let member;
  if (!activeMemberCookie) {
    return { hasPermission: () => false, role: null, member: null };
  }
  try {
    member = JSON.parse(activeMemberCookie.value);
  } catch (e) {
    return { hasPermission: () => false, role: null, member: null };
  }

  const role = member?.role as keyof typeof rolePermissionsMap;

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
}
