import { withAuth } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (_req, { searchParams }) => {
  const workspaceId = searchParams.get('workspaceId');
  if (!workspaceId) {
    return NextResponse.json(
      { error: 'workspaceId is required' },
      { status: 400 }
    );
  }

  const workspace = await prisma.organization.findUnique({
    where: { id: workspaceId },
    select: { plan: true }
  });

  return NextResponse.json({
    plan: workspace?.plan || 'Free'
  });
});
