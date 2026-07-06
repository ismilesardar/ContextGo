/**
 * GET /api/overview — aggregate workspace stats for the dashboard Overview page
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import { getWorkspaceOverview } from '@/lib/api/overview/get-workspace-overview';

const getHandler: ApiHandler = async (_req, { apiContext }) => {
  const { userId, workspaceId } = apiContext;

  if (!workspaceId) {
    return NextResponse.json(
      { error: 'No active workspace', code: 'no_active_workspace' },
      { status: 400 }
    );
  }

  const overview = await getWorkspaceOverview(userId, workspaceId);
  return NextResponse.json(overview);
};

export const GET = withAuth(getHandler);
