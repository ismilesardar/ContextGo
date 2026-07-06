import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';

export interface RecordProjectActivityInput {
  projectId: string;
  actorId: string;
  actorName: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  resourceTitle?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function recordProjectActivity(input: RecordProjectActivityInput) {
  try {
    return await prisma.projectActivity.create({ data: { ...input } });
  } catch (error) {
    console.error(
      'Failed to record project activity',
      error,
      JSON.stringify(input)
    );
  }
}
