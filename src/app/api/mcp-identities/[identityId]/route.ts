/**
 * DELETE /api/mcp-identities/[identityId] — permanently delete an MCP identity
 * (org owner/moderator only). Cascades its project resource grants and every API
 * key issued against it — deleting a service account should kill all its
 * credentials, not orphan them.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { isOrgAdmin } from '@/lib/permissions/project-access';
import { recordAuditLog } from '@/lib/api/audit-logs/record-audit-log';

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const identityId = params.identityId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  if (!(await isOrgAdmin(userId, workspaceId))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const existing = await prisma.mcpIdentity.findFirst({
    where: { id: identityId, organizationId: workspaceId }
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.mcpIdentity.delete({ where: { id: identityId } });

  await recordAuditLog({
    workspaceId,
    action: 'mcp_identity.deleted',
    actorId: userId,
    actorName: apiContext.session.user.name ?? '',
    description: `MCP User "${existing.name}" was deleted.`,
    targets: [
      {
        type: 'mcp_identity',
        id: existing.id,
        metadata: { name: existing.name }
      }
    ]
  });

  return NextResponse.json({ success: true });
};

export const DELETE = withAuth(deleteHandler);
