import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withWorkspace } from '@/lib/auth/workspace';

export const GET = withWorkspace(async ({ workspaceId }) => {
  try {
    const entries = await prisma.tokenUsageLog.findMany({
      where: { workspaceId },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        systemTokens: true,
        imageTokens: true
      }
    });

    return NextResponse.json({
      entries: entries.map((entry) => ({
        date: entry.date.toISOString().split('T')[0],
        systemTokens: entry.systemTokens,
        imageTokens: entry.imageTokens
      }))
    });
  } catch (error) {
    console.error('Failed to fetch token usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token usage data' },
      { status: 500 }
    );
  }
});
