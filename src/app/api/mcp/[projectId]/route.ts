/**
 * GET/POST/DELETE /api/mcp/[projectId] — the MCP Streamable HTTP endpoint external AI
 * clients (Claude Code, Cursor, etc.) connect to. Bypasses the app's session-based
 * `withAuth` entirely — external clients authenticate with a per-project bearer API
 * key instead, never a browser session. Every tool call is scoped to exactly the one
 * project the verified key belongs to, and further scoped to that key's individually
 * granted resources (see resolveApiKeyGrants) — a key is never able to see another
 * project's data, or resources it wasn't explicitly granted.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getIP } from '@/utils/functions/get-ip';
import {
  verifyApiKey,
  extractKeyPrefix
} from '@/lib/api/project-api-key/hash-key';
import { resolveApiKeyGrants } from '@/lib/api/project-api-key/resolve-api-key-grants';
import { buildMcpServer } from '@/lib/api/mcp/build-mcp-server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { requireUnderLimit } from '@/lib/api/plan/require-under-limit';
import arcjet, {
  slidingWindow,
  SlidingWindowRateLimitOptions
} from '@arcjet/next';
import { ARCJET_API_KEY } from '@/config/url.config';

type RouteContext = { params: Promise<{ projectId: string }> };

const mcpRateLimitSettings = {
  mode: 'LIVE',
  max: 60,
  interval: '1m'
} satisfies SlidingWindowRateLimitOptions<['apiKeyId']>;

const aj = arcjet({
  key: ARCJET_API_KEY!,
  characteristics: ['apiKeyId'],
  rules: [slidingWindow(mcpRateLimitSettings)]
});

async function authenticate(req: Request, projectId: string) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Missing bearer token' },
        { status: 401 }
      )
    };
  }

  const raw = authHeader.slice('Bearer '.length).trim();
  const prefix = extractKeyPrefix(raw);

  const apiKey = await prisma.projectApiKey.findFirst({
    where: { keyPrefix: prefix, revokedAt: null }
  });
  if (!apiKey || !verifyApiKey(raw, apiKey.keyHash)) {
    return {
      error: NextResponse.json(
        { error: 'Invalid or revoked API key' },
        { status: 401 }
      )
    };
  }

  if (apiKey.projectId !== projectId) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    };
  }

  const decision = await aj.protect(req, { apiKeyId: apiKey.id });
  if (decision.isDenied()) {
    return {
      error: NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null }
  });
  if (!project || project.status === 'archived') {
    return {
      error: NextResponse.json(
        { error: 'Project unavailable' },
        { status: 403 }
      )
    };
  }

  const organization = await prisma.organization.findUnique({
    where: { id: project.organizationId },
    select: { mcpRequestsLimit: true, lastResetDate: true }
  });
  const periodStart = organization?.lastResetDate ?? new Date(0);
  const [requestCount, responseCount] = await Promise.all([
    prisma.mcpRequestLog.count({
      where: {
        organizationId: project.organizationId,
        receivedAt: { gte: periodStart }
      }
    }),
    prisma.mcpRequestLog.count({
      where: {
        organizationId: project.organizationId,
        receivedAt: { gte: periodStart },
        respondedAt: { not: null }
      }
    })
  ]);
  const limitCheck = requireUnderLimit({
    currentCount: requestCount + responseCount,
    limit: organization?.mcpRequestsLimit ?? 5000,
    resourceLabel: 'MCP requests this month',
    status: 429
  });
  if (!limitCheck.allowed) {
    return { error: limitCheck.response };
  }

  const requestIp = await getIP(req);

  if (!apiKey.allowedIp) {
    // First use of this key: pin it to whatever IP made this request.
    await prisma.projectApiKey.update({
      where: { id: apiKey.id },
      data: { allowedIp: requestIp }
    });
  } else if (apiKey.allowedIp !== requestIp) {
    return {
      error: NextResponse.json(
        { error: 'This API key is restricted to a different IP address' },
        { status: 403 }
      )
    };
  }

  prisma.projectApiKey
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch((error) =>
      console.error('Failed to update MCP key lastUsedAt', error)
    );

  return { apiKey, organizationId: project.organizationId };
}

function logMcpRequest(
  projectId: string,
  organizationId: string,
  apiKeyId: string,
  mcpIdentityId: string,
  respondedAt: Date | null
) {
  prisma.mcpRequestLog
    .create({
      data: { projectId, organizationId, apiKeyId, mcpIdentityId, respondedAt }
    })
    .catch((error) => console.error('Failed to log MCP request', error));
}

async function handleMcpRequest(req: Request, { params }: RouteContext) {
  const { projectId } = await params;

  const auth = await authenticate(req, projectId);
  if ('error' in auth) return auth.error;

  const grants = await resolveApiKeyGrants(auth.apiKey.id);
  const server = buildMcpServer(projectId, grants);
  const transport = new WebStandardStreamableHTTPServerTransport();
  await server.connect(transport);

  try {
    const response = await transport.handleRequest(req);
    logMcpRequest(
      projectId,
      auth.organizationId,
      auth.apiKey.id,
      auth.apiKey.mcpIdentityId,
      new Date()
    );
    return response;
  } catch (error) {
    logMcpRequest(
      projectId,
      auth.organizationId,
      auth.apiKey.id,
      auth.apiKey.mcpIdentityId,
      null
    );
    throw error;
  }
}

export async function GET(req: Request, ctx: RouteContext) {
  return handleMcpRequest(req, ctx);
}

export async function POST(req: Request, ctx: RouteContext) {
  return handleMcpRequest(req, ctx);
}

export async function DELETE(req: Request, ctx: RouteContext) {
  return handleMcpRequest(req, ctx);
}
