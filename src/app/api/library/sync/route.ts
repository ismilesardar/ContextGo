/**
 * POST /api/library/sync — manually trigger a resync of the library
 * template cache from github/awesome-copilot (also runs automatically once a
 * day via the library-sync cron). Gated by `isOrgAdmin` for the caller's
 * active workspace — reuses the existing org-admin check rather than
 * introducing a new system-admin permission primitive for one low-stakes,
 * idempotent action.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import { isOrgAdmin } from '@/lib/permissions/project-access';
import { syncLibraryTemplates } from '@/lib/api/library/sync-library';

const syncHandler: ApiHandler = async (_req, { apiContext }) => {
  const { userId, workspaceId } = apiContext;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  if (!(await isOrgAdmin(userId, workspaceId))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const summary = await syncLibraryTemplates();

  return NextResponse.json({ summary });
};

export const POST = withAuth(syncHandler);
