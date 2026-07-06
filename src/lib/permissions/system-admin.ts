import { ACCESS_TYPE } from '@/utils/constants/organization-const';

/**
 * True only for the platform-level system admin (`User.accessType`), the
 * same flag that gates the `/system-admin` area — distinct from per-org
 * owner/moderator roles, which are scoped to a single workspace.
 */
export function isSystemAdmin(
  user: { accessType?: number | null } | null | undefined
): boolean {
  return user?.accessType === ACCESS_TYPE.SYSTEM;
}
