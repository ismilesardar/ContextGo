import prisma from '@/lib/prisma';

export type ProjectAccessRole = 'owner' | 'member' | 'viewer';

export interface ProjectAccess {
  role: ProjectAccessRole;
  isOrgAdmin: boolean;
}

const ORG_ADMIN_ROLES = ['owner', 'moderator'];

/**
 * True if the user holds an org-level owner/moderator role — the only roles
 * allowed to create, manage, or (once built) add assets to projects.
 */
export async function isOrgAdmin(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const orgMember = await prisma.member.findFirst({
    where: { organizationId, userId }
  });
  return !!orgMember && ORG_ADMIN_ROLES.includes(orgMember.role);
}

/**
 * Resolves a user's effective access to a project.
 * Org owner/moderator implicitly get full access to every project in their org.
 * Everyone else needs an explicit ProjectMember row — returns null otherwise.
 */
export async function getProjectAccess(
  projectId: string,
  userId: string,
  organizationId: string
): Promise<ProjectAccess | null> {
  if (await isOrgAdmin(userId, organizationId)) {
    return { role: 'owner', isOrgAdmin: true };
  }

  const projectMember = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  });

  if (!projectMember) return null;

  return { role: projectMember.role as ProjectAccessRole, isOrgAdmin: false };
}

/**
 * Only org owner/moderator can manage a project (edit/archive/delete/manage
 * members) or any resource inside it (Contexts, and future
 * Instructions/Skills/Prompt Templates/Checklists) — project-level
 * ProjectMember roles are always read-level. Per explicit requirement: asset
 * creation inside a project must be gated the same way as project
 * management, not opened up to any project member.
 */
export function canManageProject(access: ProjectAccess | null): boolean {
  return access?.isOrgAdmin === true;
}
