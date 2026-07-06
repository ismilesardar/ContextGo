/**
 * GET /api/library/templates — list cached library templates synced
 * from external sources (currently github/awesome-copilot). Open to any
 * authenticated user — this is global platform data, not tenant data.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 100;

const listHandler: ApiHandler = async (_req, { searchParams }) => {
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const tag = searchParams.get('tag');

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE)
  );

  const where = {
    ...(category ? { sourceCategory: category } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            {
              description: { contains: search, mode: 'insensitive' as const }
            }
          ]
        }
      : {})
  };

  const [templates, total] = await Promise.all([
    prisma.libraryTemplate.findMany({
      where,
      select: {
        id: true,
        source: true,
        sourcePath: true,
        sourceCategory: true,
        sourceUrl: true,
        title: true,
        description: true,
        tags: true,
        suggestedResourceType: true,
        lastSyncedAt: true
      },
      orderBy: { title: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.libraryTemplate.count({ where })
  ]);

  return NextResponse.json({
    templates,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  });
};

export const GET = withAuth(listHandler);
