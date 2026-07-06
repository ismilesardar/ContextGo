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
import {
  verifyApiKey,
  extractKeyPrefix
} from '@/lib/api/project-api-key/hash-key';
import { resolveApiKeyGrants } from '@/lib/api/project-api-key/resolve-api-key-grants';
import { buildMcpServer } from '@/lib/api/mcp/build-mcp-server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

type RouteContext = { params: Promise<{ projectId: string }> };

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

  prisma.projectApiKey
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch((error) =>
      console.error('Failed to update MCP key lastUsedAt', error)
    );

  return { apiKey };
}

async function handleMcpRequest(req: Request, { params }: RouteContext) {
  const { projectId } = await params;

  const auth = await authenticate(req, projectId);
  if ('error' in auth) return auth.error;

  const grants = await resolveApiKeyGrants(auth.apiKey.id);
  const server = buildMcpServer(projectId, grants);
  const transport = new WebStandardStreamableHTTPServerTransport();
  await server.connect(transport);

  return transport.handleRequest(req);
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
