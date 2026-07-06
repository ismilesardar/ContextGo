/**
 * GET  /api/projects/[projectId]/members — list project members (any access required)
 * POST /api/projects/[projectId]/members — add a workspace member to the project (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { projectMemberSchema } from '@/lib/zod-schema/project-schema';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

async function loadProject(projectId: string, workspaceId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
}

const listHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await loadProject(projectId, workspaceId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json({ members });
};

const createHandler: ApiHandler = async (
  _req,
  { apiContext, params, body }
) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await loadProject(projectId, workspaceId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = projectMemberSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const { userId: targetUserId, role } = validation.data;

  const targetOrgMember = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: targetUserId }
  });
  if (!targetOrgMember) {
    return NextResponse.json(
      {
        error: 'User is not a member of this workspace',
        code: 'not_org_member'
      },
      { status: 400 }
    );
  }

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: targetUserId } }
  });
  if (existing) {
    return NextResponse.json(
      {
        error: 'User already has access to this project',
        code: 'already_member'
      },
      { status: 409 }
    );
  }

  const member = await prisma.projectMember.create({
    data: { projectId, userId: targetUserId, role },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'project_member.added',
    resourceType: 'project_member',
    resourceId: member.id,
    resourceTitle: member.user.name
  });

  return NextResponse.json({ member }, { status: 201 });
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
