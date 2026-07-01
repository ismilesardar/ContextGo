import prisma from '@/lib/prisma';
import { recordAuditLogInputSchema } from '@/lib/zod-schema/audit-schema';
import { createId } from '@/utils/functions/create-id';
import { getIP } from '@/utils/functions/get-ip';
import { headers } from 'next/headers';
import * as z from 'zod/v4';

type AuditLogInput = z.infer<typeof recordAuditLogInputSchema>;

const transformAuditLogTB = (
  data: AuditLogInput,
  {
    headersList,
    ipAddress
  }: { headersList: Headers; ipAddress: string | undefined }
) => {
  const userAgent = headersList.get('user-agent');

  const auditLogInput = recordAuditLogInputSchema.parse({
    ...data,
    ipAddress,
    userAgent
  });

  return {
    id: createId({ prefix: 'audit_' }),
    timestamp: new Date().toISOString(),
    workspaceId: auditLogInput.workspaceId,
    // programId: auditLogInput.programId,
    action: auditLogInput.action,
    actorId: auditLogInput.actorId,
    actorType: auditLogInput.actorType ?? 'member',
    actorName: auditLogInput.actorName ?? '',
    description: auditLogInput.description ?? '',
    targets: auditLogInput.targets ? JSON.stringify(auditLogInput.targets) : '',
    metadata: auditLogInput.metadata
      ? JSON.stringify(auditLogInput.metadata)
      : '',
    ipAddress: ipAddress ?? '',
    userAgent: userAgent ?? ''
  };
};

export const recordAuditLog = async (data: AuditLogInput) => {
  const headersList = await headers();
  const dataReq = Array.isArray(data)
    ? data.map((d) => d.req).find((d) => d)
    : data.req;
  const ipAddress = dataReq ? await getIP(dataReq) : await getIP();

  const auditLogs = Array.isArray(data)
    ? data.map((d) => transformAuditLogTB(d, { headersList, ipAddress }))
    : [transformAuditLogTB(data, { headersList, ipAddress })];

  try {
    // We spread the validated data directly into the model
    const log = await prisma.audit.create({
      data: auditLogs[0]
    });
    return log;
  } catch (error) {
    console.error(
      'Failed to record audit log',
      error,
      JSON.stringify(auditLogs)
    );

    // await log({
    //   message: "Failed to record audit log. See logs for more details.",
    //   type: "errors",
    //   mention: true,
    // });
  }
};
