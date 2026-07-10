/**
 * GET    /api/public-assets/[assetId] — fetch one public asset (with content),
 *   open to any authenticated user.
 * PATCH  /api/public-assets/[assetId] — update title/description/content,
 *   author only.
 * DELETE /api/public-assets/[assetId] — remove the asset, author only.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { publicAssetUpdateSchema } from '@/lib/zod-schema/public-asset-schema';

const AUTHOR_SELECT = { id: true, name: true, image: true } as const;

const getHandler: ApiHandler = async (_req, { params }) => {
  const assetId = params.assetId as string;

  const asset = await prisma.publicAsset.findUnique({
    where: { id: assetId },
    include: { createdBy: { select: AUTHOR_SELECT } }
  });
  if (!asset) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ asset });
};

const updateHandler: ApiHandler = async (
  _req,
  { apiContext, params, body }
) => {
  const assetId = params.assetId as string;

  const existing = await prisma.publicAsset.findUnique({
    where: { id: assetId }
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.createdById !== apiContext.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = publicAssetUpdateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const asset = await prisma.publicAsset.update({
    where: { id: assetId },
    data: validation.data,
    include: { createdBy: { select: AUTHOR_SELECT } }
  });

  return NextResponse.json({ asset });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const assetId = params.assetId as string;

  const existing = await prisma.publicAsset.findUnique({
    where: { id: assetId }
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.createdById !== apiContext.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.publicAsset.delete({ where: { id: assetId } });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(updateHandler);
export const DELETE = withAuth(deleteHandler);
