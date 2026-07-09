/**
 * POST /api/projects/[projectId]/mcp/keys/[keyId]/reset-ip
 * Clears an MCP API key's IP binding (org owner/moderator only). The key auto-pins to
 * whatever IP makes its next request, so this is the recovery path when a legitimate
 * user's IP has changed (e.g. their ISP reassigned it, they switched networks).
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const resetIpHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const keyId = params.keyId as string;

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

  const existing = await prisma.projectApiKey.findFirst({
    where: { id: keyId, projectId }
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const apiKey = await prisma.projectApiKey.update({
    where: { id: keyId },
    data: { allowedIp: null },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      mcpIdentity: { select: { id: true, name: true } }
    }
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'mcp_key.ip_reset',
    resourceType: 'mcp_key',
    resourceId: keyId,
    resourceTitle: apiKey.name
  });

  const { keyHash: _keyHash, ...apiKeyResponse } = apiKey;

  return NextResponse.json({ apiKey: apiKeyResponse });
};

export const POST = withAuth(resetIpHandler);
