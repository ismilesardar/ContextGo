/**
 * GET  /api/projects/[projectId]/agent-profiles — list Agent Profiles in a project (any access required)
 * POST /api/projects/[projectId]/agent-profiles — create an Agent Profile (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { agentProfileSchema } from '@/lib/zod-schema/agent-profile-schema';
import { createSlug } from '@/utils/create-slug';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

async function loadProject(projectId: string, workspaceId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
}

async function uniqueAgentProfileSlug(projectId: string, base: string) {
  let slug = base;
  let suffix = 1;
  while (
    await prisma.agentProfile.findUnique({
      where: { projectId_slug: { projectId, slug } }
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

const listHandler: ApiHandler = async (
  _req,
  { apiContext, params, searchParams }
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
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const agentProfiles = await prisma.agentProfile.findMany({
    where: {
      projectId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              {
                description: { contains: search, mode: 'insensitive' as const }
              }
            ]
          }
        : {})
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      _count: { select: { resources: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json({ agentProfiles });
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

  const validation = agentProfileSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const baseSlug = createSlug(validation.data.title) || 'agent-profile';
  const slug = await uniqueAgentProfileSlug(projectId, baseSlug);

  const agentProfile = await prisma.agentProfile.create({
    data: {
      ...validation.data,
      projectId,
      slug,
      createdById: userId,
      updatedById: userId
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      _count: { select: { resources: true } }
    }
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'agent_profile.created',
    resourceType: 'agent_profile',
    resourceId: agentProfile.id,
    resourceTitle: agentProfile.title
  });

  return NextResponse.json({ agentProfile }, { status: 201 });
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
