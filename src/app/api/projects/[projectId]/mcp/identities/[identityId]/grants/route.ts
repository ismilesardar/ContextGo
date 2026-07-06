/**
 * PUT /api/projects/[projectId]/mcp/identities/[identityId]/grants
 * Replaces the full set of resources an MCP identity can see within this project
 * (org owner/moderator only) — mirrors the Agent Profile resources PUT route's
 * "submit the whole current selection" shape. An empty `resources` array is valid
 * and un-grants the identity from this project (no grant rows = no access).
 * Any ProjectApiKey already issued for this identity+project automatically
 * reflects the new scope on its next MCP request — keys don't need reissuing.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { setMcpIdentityGrantsSchema } from '@/lib/zod-schema/mcp-identity-grant-schema';
import { allResourcesBelongToProject } from '@/lib/api/project-api-key/verify-resource-ownership';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const putHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const identityId = params.identityId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const identity = await prisma.mcpIdentity.findFirst({
    where: { id: identityId, organizationId: workspaceId }
  });
  if (!identity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = setMcpIdentityGrantsSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const { resources } = validation.data;

  if (resources.length > 0) {
    const allOwned = await allResourcesBelongToProject(resources, projectId);
    if (!allOwned) {
      return NextResponse.json(
        {
          error: 'One or more selected resources do not belong to this project',
          code: 'invalid_resource_scope'
        },
        { status: 400 }
      );
    }
  }

  const previousCount = await prisma.mcpIdentityResourceGrant.count({
    where: { mcpIdentityId: identityId, projectId }
  });

  const grants = await prisma.$transaction(async (tx) => {
    await tx.mcpIdentityResourceGrant.deleteMany({
      where: { mcpIdentityId: identityId, projectId }
    });

    if (resources.length > 0) {
      await tx.mcpIdentityResourceGrant.createMany({
        data: resources.map((ref) => ({
          mcpIdentityId: identityId,
          projectId,
          resourceType: ref.resourceType,
          resourceId: ref.resourceId
        }))
      });
    }

    return tx.mcpIdentityResourceGrant.findMany({
      where: { mcpIdentityId: identityId, projectId }
    });
  });

  const action =
    previousCount === 0 && grants.length > 0
      ? 'mcp_identity.granted'
      : previousCount > 0 && grants.length === 0
        ? 'mcp_identity.removed_from_project'
        : 'mcp_identity.grant_updated';

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action,
    resourceType: 'mcp_identity',
    resourceId: identity.id,
    resourceTitle: identity.name,
    metadata: { resourceCount: grants.length }
  });

  return NextResponse.json({ grants });
};

export const PUT = withAuth(putHandler);
