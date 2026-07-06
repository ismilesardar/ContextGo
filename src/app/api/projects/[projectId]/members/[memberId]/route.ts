/**
 * PATCH  /api/projects/[projectId]/members/[memberId] — change a project member's role (org owner/moderator only)
 * DELETE /api/projects/[projectId]/members/[memberId] — remove a project member (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { projectMemberRoleSchema } from '@/lib/zod-schema/project-schema';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

async function assertManageAccess(
  projectId: string,
  workspaceId: string | undefined,
  userId: string
) {
  if (!workspaceId) return null;

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
  if (!project) return null;

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) return null;

  return project;
}

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const memberId = params.memberId as string;

  const project = await assertManageAccess(projectId, workspaceId, userId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const member = await prisma.projectMember.findFirst({
    where: { id: memberId, projectId }
  });
  if (!member) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = projectMemberRoleSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const updated = await prisma.projectMember.update({
    where: { id: memberId },
    data: { role: validation.data.role },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'project_member.role_changed',
    resourceType: 'project_member',
    resourceId: memberId,
    resourceTitle: updated.user.name,
    metadata: { role: validation.data.role }
  });

  return NextResponse.json({ member: updated });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const memberId = params.memberId as string;

  const project = await assertManageAccess(projectId, workspaceId, userId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const member = await prisma.projectMember.findFirst({
    where: { id: memberId, projectId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });
  if (!member) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.projectMember.delete({ where: { id: memberId } });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'project_member.removed',
    resourceType: 'project_member',
    resourceId: memberId,
    resourceTitle: member.user.name
  });

  return NextResponse.json({ success: true });
};

export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
