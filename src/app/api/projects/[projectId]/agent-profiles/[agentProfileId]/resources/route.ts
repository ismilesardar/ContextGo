/**
 * PUT /api/projects/[projectId]/agent-profiles/[agentProfileId]/resources
 * Replaces the full set of resources bundled into this Agent Profile in one call
 * (org owner/moderator only) — simplest shape for a picker UI that submits its whole
 * selection at once rather than one add/remove call per item.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { agentProfileResourcesSchema } from '@/lib/zod-schema/agent-profile-schema';
import { resolveAgentProfileResources } from '@/lib/api/resolve-agent-profile-resources';

const putHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const agentProfileId = params.agentProfileId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await prisma.agentProfile.findFirst({
    where: {
      id: agentProfileId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = agentProfileResourcesSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.agentProfileResource.deleteMany({ where: { agentProfileId } });
    if (validation.data.resources.length > 0) {
      await tx.agentProfileResource.createMany({
        data: validation.data.resources.map((ref, index) => ({
          agentProfileId,
          resourceType: ref.resourceType,
          resourceId: ref.resourceId,
          order: index
        }))
      });
    }
    await tx.agentProfile.update({
      where: { id: agentProfileId },
      data: { updatedById: userId }
    });
  });

  const agentProfile = await prisma.agentProfile.findUniqueOrThrow({
    where: { id: agentProfileId },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      resources: { orderBy: { order: 'asc' } }
    }
  });

  const resolvedResources = await resolveAgentProfileResources(
    agentProfile.resources
  );

  return NextResponse.json({
    agentProfile: { ...agentProfile, resources: resolvedResources }
  });
};

export const PUT = withAuth(putHandler);
