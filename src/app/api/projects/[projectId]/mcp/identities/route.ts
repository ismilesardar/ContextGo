/**
 * GET /api/projects/[projectId]/mcp/identities — list MCP identities currently
 * granted access to this project (any project access required), each with its
 * resource grants and API keys scoped to this project. Each key's raw secret is
 * only included for org owner/moderator callers (see mcp/keys/route.ts).
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { AUTHOR_SELECT } from '@/lib/api/author-select';

const listHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

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
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const grantedIdentityIds = await prisma.mcpIdentityResourceGrant.findMany({
    where: { projectId },
    select: { mcpIdentityId: true },
    distinct: ['mcpIdentityId']
  });

  const identities = await prisma.mcpIdentity.findMany({
    where: { id: { in: grantedIdentityIds.map((g) => g.mcpIdentityId) } },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      grants: { where: { projectId } },
      apiKeys: {
        where: { projectId },
        include: { createdBy: { select: AUTHOR_SELECT } },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const canSeeSecret = canManageProject(access);

  const sanitized = identities.map((identity) => ({
    ...identity,
    apiKeys: identity.apiKeys.map(({ keyHash: _keyHash, secret, ...key }) => ({
      ...key,
      secret: canSeeSecret ? secret : null
    }))
  }));

  return NextResponse.json({ identities: sanitized });
};

export const GET = withAuth(listHandler);
