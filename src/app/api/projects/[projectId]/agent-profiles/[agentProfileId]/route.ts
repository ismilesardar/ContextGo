/**
 * GET    /api/projects/[projectId]/agent-profiles/[agentProfileId] — fetch an Agent Profile with its
 *        resolved resources (any access required)
 * PATCH  /api/projects/[projectId]/agent-profiles/[agentProfileId] — update title/description, or
 *        publish/unpublish via { status } (org owner/moderator only). Unlike Contexts, there is no
 *        version history here — an edit updates the live row directly.
 * DELETE /api/projects/[projectId]/agent-profiles/[agentProfileId] — permanent delete, cascades its
 *        AgentProfileResource rows (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { agentProfileSchema } from '@/lib/zod-schema/agent-profile-schema';
import { resolveAgentProfileResources } from '@/lib/api/resolve-agent-profile-resources';

const updateBodySchema = z.union([
  z.object({ status: z.enum(['draft', 'published']) }),
  agentProfileSchema.partial()
]);

async function loadAgentProfile(
  agentProfileId: string,
  projectId: string,
  workspaceId: string
) {
  return prisma.agentProfile.findFirst({
    where: {
      id: agentProfileId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
}

const getHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const agentProfileId = params.agentProfileId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const agentProfile = await prisma.agentProfile.findFirst({
    where: {
      id: agentProfileId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      resources: { orderBy: { order: 'asc' } }
    }
  });
  if (!agentProfile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const resolvedResources = await resolveAgentProfileResources(
    agentProfile.resources
  );

  return NextResponse.json({
    agentProfile: { ...agentProfile, resources: resolvedResources }
  });
};

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const agentProfileId = params.agentProfileId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadAgentProfile(
    agentProfileId,
    projectId,
    workspaceId
  );
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = updateBodySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const agentProfile = await prisma.agentProfile.update({
    where: { id: agentProfileId },
    data: { ...validation.data, updatedById: userId },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      _count: { select: { resources: true } }
    }
  });

  return NextResponse.json({ agentProfile });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const agentProfileId = params.agentProfileId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadAgentProfile(
    agentProfileId,
    projectId,
    workspaceId
  );
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.agentProfile.delete({ where: { id: agentProfileId } });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
