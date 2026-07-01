import { formatUTCDateTimeClickHouse } from '@/utils/functions/datetime/format-utc-datetime-clickhouse';
import * as z from 'zod/v4';
import prisma from '@/lib/prisma';

export const auditLogFilterSchemaTB = z.object({
  workspaceId: z.string(),
  start: z.string(),
  end: z.string()
});

export const auditLogResponseSchemaTB = z.object({
  id: z.string(),
  timestamp: z.string(),
  action: z.string(),
  actor_id: z.string(),
  actor_type: z.string(),
  actor_name: z.string(),
  description: z.string(),
  ip_address: z.string(),
  user_agent: z.string(),
  targets: z.string(),
  metadata: z.string()
});

export const getAuditLogs = async ({
  workspaceId,
  start,
  end
}: {
  start: Date;
  end: Date;
  workspaceId: string;
}) => {
  // Validate filter inputs (convert dates to ClickHouse-style strings)
  const parsed = auditLogFilterSchemaTB.parse({
    workspaceId,
    start: formatUTCDateTimeClickHouse(start),
    end: formatUTCDateTimeClickHouse(end)
  });

  // Query by workspace and createdAt range
  const docs = await prisma.audit.findMany({
    where: {
      workspaceId: parsed.workspaceId,
      createdAt: {
        gte: start,
        lte: end
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const results = docs.map((d: any) => {
    const normalizeJsonField = (val: any) => {
      if (val === undefined || val === null) return '';

      // If it's not a string, stringify safely
      if (typeof val !== 'string') {
        try {
          return JSON.stringify(val);
        } catch (e) {
          return String(val);
        }
      }

      // Work on a trimmed copy
      let v = val.trim();

      // Try to iteratively JSON.parse up to a few times to unwrap double-stringified values
      for (let i = 0; i < 3; i++) {
        try {
          const parsed = JSON.parse(v);
          // If parsing yields a string, continue unwrapping
          if (typeof parsed === 'string') {
            v = parsed;
            continue;
          }
          // If parsed to an object/array/number, return canonical JSON
          return JSON.stringify(parsed);
        } catch (e) {
          break;
        }
      }

      // If we couldn't parse, try to clean common escape artifacts
      // Collapse doubled double-quotes and unescape backslash-escaped quotes
      let cleaned = v
        .replace(/""/g, '"')
        .replace(/\\"/g, '"')
        .replace(/\\\\"/g, '"');

      // Try parsing cleaned string
      try {
        const parsedClean = JSON.parse(cleaned);
        return JSON.stringify(parsedClean);
      } catch (e) {
        // As a last resort, replace remaining double-quotes with single quotes
        // to avoid breaking CSV quoting, and return the cleaned string
        return cleaned.replace(/"/g, "'");
      }
    };

    const targets = normalizeJsonField(d.targets ?? []);
    const metadata = normalizeJsonField(d.metadata ?? {});
    const timestampDate = d.timestamp
      ? new Date(d.timestamp)
      : d.createdAt
        ? new Date(d.createdAt)
        : new Date();

    return {
      id: d.id ?? (d._id ? d._id.toString() : ''),
      timestamp: formatUTCDateTimeClickHouse(timestampDate),
      action: d.action ?? '',
      actor_id: d.actorId ?? '',
      actor_type: d.actorType ?? '',
      actor_name: d.actorName ?? '',
      description: d.description ?? '',
      ip_address: d.ipAddress ?? '',
      user_agent: d.userAgent ?? '',
      targets,
      metadata
    };
  });

  return auditLogResponseSchemaTB.array().parse(results);
};
