/**
 * GET  /api/projects/[projectId]/mcp/keys — list MCP API keys for a project (any access
 *      required). Never returns keyHash. The raw secret is only included for
 *      org owner/moderator callers, since they're the ones trusted to hand keys to
 *      teammates via the "Copy configuration" action.
 * POST /api/projects/[projectId]/mcp/keys — create a new MCP API key for an MCP identity
 *      already granted access to this project (org owner/moderator only). The key itself
 *      carries no resource scope — everything it can see is resolved live from the
 *      identity's grants at request time.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import { createProjectApiKeySchema } from '@/lib/zod-schema/project-api-key-schema';
import { generateApiKey } from '@/lib/api/project-api-key/hash-key';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';
import { requireUnderLimit } from '@/lib/api/plan/require-under-limit';

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

  const apiKeys = await prisma.projectApiKey.findMany({
    where: { projectId },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      mcpIdentity: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const canSeeSecret = canManageProject(access);

  return NextResponse.json({
    apiKeys: apiKeys.map(({ keyHash: _keyHash, secret, ...key }) => ({
      ...key,
      secret: canSeeSecret ? secret : null
    }))
  });
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

  const validation = createProjectApiKeySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const { name, mcpIdentityId } = validation.data;

  const identity = await prisma.mcpIdentity.findFirst({
    where: { id: mcpIdentityId, organizationId: workspaceId }
  });
  if (!identity) {
    return NextResponse.json({ error: 'MCP User not found' }, { status: 404 });
  }

  const hasGrant = await prisma.mcpIdentityResourceGrant.findFirst({
    where: { mcpIdentityId, projectId }
  });
  if (!hasGrant) {
    return NextResponse.json(
      {
        error: 'This MCP User has no resources granted in this project yet',
        code: 'identity_not_granted'
      },
      { status: 400 }
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { id: workspaceId },
    select: { mcpApiKeysLimit: true, lastResetDate: true }
  });
  const existingKeyCount = await prisma.projectApiKey.count({
    where: {
      projectId,
      revokedAt: null,
      createdAt: { gte: organization?.lastResetDate ?? new Date(0) }
    }
  });
  const limitCheck = requireUnderLimit({
    currentCount: existingKeyCount,
    limit: organization?.mcpApiKeysLimit ?? 3,
    resourceLabel: 'API keys for this project'
  });
  if (!limitCheck.allowed) return limitCheck.response;

  const { raw, prefix, hash } = generateApiKey();

  const apiKey = await prisma.projectApiKey.create({
    data: {
      projectId,
      mcpIdentityId,
      name,
      keyPrefix: prefix,
      keyHash: hash,
      secret: raw,
      createdById: userId
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      mcpIdentity: { select: { id: true, name: true } }
    }
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'mcp_key.created',
    resourceType: 'mcp_key',
    resourceId: apiKey.id,
    resourceTitle: apiKey.name,
    metadata: { mcpIdentityId, mcpIdentityName: identity.name }
  });

  const { keyHash: _keyHash, secret: _secret, ...apiKeyResponse } = apiKey;

  return NextResponse.json(
    { apiKey: apiKeyResponse, secret: raw },
    { status: 201 }
  );
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
