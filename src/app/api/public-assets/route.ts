/**
 * GET  /api/public-assets — list community-submitted public assets. Global,
 * cross-tenant data (no workspace/project scoping) — open to any
 * authenticated user, mirroring /api/library/templates.
 * POST /api/public-assets — publish a new public asset. Any authenticated
 * user may create one; there is no per-org/project gating since these
 * assets don't belong to an organization.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { publicAssetSchema } from '@/lib/zod-schema/public-asset-schema';
import { createSlug } from '@/utils/create-slug';

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 100;

const AUTHOR_SELECT = { id: true, name: true, image: true } as const;

async function uniquePublicAssetSlug(base: string) {
  let slug = base;
  let suffix = 1;
  while (await prisma.publicAsset.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

const listHandler: ApiHandler = async (_req, { searchParams }) => {
  const resourceType = searchParams.get('resourceType');
  const search = searchParams.get('search');

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE)
  );

  const where = {
    ...(resourceType ? { resourceType } : {}),
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

  const [assets, total] = await Promise.all([
    prisma.publicAsset.findMany({
      where,
      select: {
        id: true,
        resourceType: true,
        title: true,
        slug: true,
        description: true,
        createdById: true,
        createdBy: { select: AUTHOR_SELECT },
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.publicAsset.count({ where })
  ]);

  return NextResponse.json({
    assets,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  });
};

const createHandler: ApiHandler = async (_req, { apiContext, body }) => {
  const { userId } = apiContext;

  const validation = publicAssetSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const baseSlug = createSlug(validation.data.title) || 'asset';
  const slug = await uniquePublicAssetSlug(baseSlug);

  const asset = await prisma.publicAsset.create({
    data: {
      ...validation.data,
      slug,
      createdById: userId
    },
    select: {
      id: true,
      resourceType: true,
      title: true,
      slug: true,
      description: true,
      createdById: true,
      createdBy: { select: AUTHOR_SELECT },
      createdAt: true,
      updatedAt: true
    }
  });

  return NextResponse.json({ asset }, { status: 201 });
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
