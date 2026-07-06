/**
 * POST /api/library/sync — manually trigger a resync of the library
 * template cache from github/awesome-copilot (also runs automatically once a
 * day via the library-sync cron). Gated by `isSystemAdmin` (the platform
 * superadmin flag, not per-org owner/moderator) since the underlying GitHub
 * API rate limit is shared globally across the whole app — letting every
 * tenant's org admin trigger this independently could exhaust that shared
 * quota for everyone. This is a global action with no workspace scope.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import { isSystemAdmin } from '@/lib/permissions/system-admin';
import { syncLibraryTemplates } from '@/lib/api/library/sync-library';

const syncHandler: ApiHandler = async (_req, { apiContext }) => {
  if (!isSystemAdmin(apiContext.session.user)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const summary = await syncLibraryTemplates();
    return NextResponse.json({ summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Library sync failed';
    const isRateLimit = message.includes('rate limit exceeded');
    return NextResponse.json(
      { error: message },
      { status: isRateLimit ? 429 : 500 }
    );
  }
};

export const POST = withAuth(syncHandler);
