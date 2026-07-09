import { NextResponse } from 'next/server';
import { withWorkspace } from '@/lib/auth/workspace';
import { getWorkspaceResourceUsage } from '@/lib/api/plan/get-workspace-resource-usage';

export const GET = withWorkspace(
  async ({ workspaceId, activeOrganization }) => {
    try {
      // See src/app/api/billing/change-plan/route.ts for why this guard
      // exists: `withWorkspace` doesn't re-validate org membership when
      // `workspaceId` is overridden via a query param.
      if (workspaceId !== activeOrganization?.id) {
        return NextResponse.json(
          { error: 'Forbidden', code: 'workspace_mismatch' },
          { status: 403 }
        );
      }

      const usage = await getWorkspaceResourceUsage(workspaceId);
      return NextResponse.json({ usage });
    } catch (error) {
      console.error('Failed to fetch resource usage:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resource usage' },
        { status: 500 }
      );
    }
  }
);
