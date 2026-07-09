/**
 * GET  /api/mcp-identities — list MCP identities (service accounts) for the active
 *      organization (org owner/moderator only).
 * POST /api/mcp-identities — create an MCP identity (org owner/moderator only).
 *
 * An MCP identity has no login/session of its own — it's a named record an org
 * admin grants into specific projects (with specific resource permissions), whose
 * only real manifestation is an MCP API key issued against it.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { isOrgAdmin } from '@/lib/permissions/project-access';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import { mcpIdentitySchema } from '@/lib/zod-schema/mcp-identity-schema';
import { recordAuditLog } from '@/lib/api/audit-logs/record-audit-log';
import { requireUnderLimit } from '@/lib/api/plan/require-under-limit';

const listHandler: ApiHandler = async (_req, { apiContext }) => {
  const { userId, workspaceId } = apiContext;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  if (!(await isOrgAdmin(userId, workspaceId))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const identities = await prisma.mcpIdentity.findMany({
    where: { organizationId: workspaceId },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      _count: { select: { grants: true, apiKeys: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ identities });
};

const createHandler: ApiHandler = async (_req, { apiContext, body }) => {
  const { userId, workspaceId } = apiContext;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  if (!(await isOrgAdmin(userId, workspaceId))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = mcpIdentitySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { id: workspaceId },
    select: { mcpIdentitiesLimit: true, lastResetDate: true }
  });
  const existingCount = await prisma.mcpIdentity.count({
    where: {
      organizationId: workspaceId,
      createdAt: { gte: organization?.lastResetDate ?? new Date(0) }
    }
  });
  const limitCheck = requireUnderLimit({
    currentCount: existingCount,
    limit: organization?.mcpIdentitiesLimit ?? 1,
    resourceLabel: 'MCP Users'
  });
  if (!limitCheck.allowed) return limitCheck.response;

  const identity = await prisma.mcpIdentity.create({
    data: {
      organizationId: workspaceId,
      name: validation.data.name,
      createdById: userId
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      _count: { select: { grants: true, apiKeys: true } }
    }
  });

  await recordAuditLog({
    workspaceId,
    action: 'mcp_identity.created',
    actorId: userId,
    actorName: apiContext.session.user.name ?? '',
    description: `MCP User "${identity.name}" was created.`,
    targets: [
      {
        type: 'mcp_identity',
        id: identity.id,
        metadata: { name: identity.name }
      }
    ]
  });

  return NextResponse.json({ identity }, { status: 201 });
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
