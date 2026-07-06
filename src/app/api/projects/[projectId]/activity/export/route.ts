/**
 * GET /api/projects/[projectId]/activity/export — CSV export of a project's
 * full activity log. Admin-only (org owner/moderator), unlike the read-only
 * feed at /activity which any project member can view.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { convertToCSV } from '@/utils/functions/convert-to-csv';

const EXPORT_LIMIT = 50_000;

const exportHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

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

  const activities = await prisma.projectActivity.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    take: EXPORT_LIMIT
  });

  const csvData = await convertToCSV(activities as unknown as object[]);

  return new Response(csvData, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="project-activity.csv"`
    }
  });
};

export const GET = withAuth(exportHandler);
