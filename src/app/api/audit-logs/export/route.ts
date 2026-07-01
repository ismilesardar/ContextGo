import { getAuditLogs } from '@/lib/api/audit-logs/get-audit-logs';
import { parseRequestBody } from '@/lib/api/utils';
import { withWorkspace } from '@/lib/auth/workspace';
import { convertToCSV } from '@/utils/functions/convert-to-csv';
import { NextResponse } from 'next/server';
import * as z from 'zod/v4';

const auditLogExportQuerySchema = z.object({
  start: z.string(),
  end: z.string()
});

// POST /api/audit-logs/export – export audit logs to CSV
export const POST = withWorkspace(
  async ({ req, workspaceId, body }) => {
    // Use already-parsed `body` from the auth wrapper when available to
    // avoid reading the request stream twice (which causes "Body is unusable").
    let parsedBody: any = body ?? undefined;

    if (!parsedBody) {
      try {
        parsedBody = await parseRequestBody(req);
      } catch (err: any) {
        // If parseRequestBody threw a Response/NextResponse, return it directly
        if (err instanceof Response || err instanceof NextResponse) {
          return err;
        }

        return NextResponse.json(
          {
            code: 'bad_request',
            message: err?.message || 'Invalid JSON in request body'
          },
          { status: err?.status || 400 }
        );
      }
    }

    const { start, end } = auditLogExportQuerySchema.parse(parsedBody || {});

    if (!start || !end) {
      return NextResponse.json(
        {
          code: 'bad_request',
          message: 'Must provide start and end dates.'
        },
        { status: 400 }
      );
    }

    try {
      const auditLogs = await getAuditLogs({
        workspaceId: workspaceId,
        start: new Date(start),
        end: new Date(end)
      });

      // convertToCSV returns the CSV string — await it
      const csvData = await convertToCSV(auditLogs as any[]);

      return new Response(csvData, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="audit-logs.csv"`
        }
      });
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      return NextResponse.json(
        { code: 'internal_error', message: 'Failed to export audit logs' },
        { status: 500 }
      );
    }
  },
  {
    requiredPermissions: ['workspaces.write'],
    requiredRoles: ['owner', 'moderator'],
    requireActiveOrganization: true
  }
);
