/**
 * POST /api/public-assets/[assetId]/import — create a new project resource
 * (Context/Instruction/Skill/PromptTemplate/Checklist) from a community
 * public asset. Gated by `canManageProject` for the submitted `projectId` —
 * identical rule to every existing "create a resource" route and to the
 * GitHub-synced library's own import route.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { publicAssetImportSchema } from '@/lib/zod-schema/public-asset-schema';
import { importPublicAssetToProject } from '@/lib/api/public-assets/import-public-asset';

const importHandler: ApiHandler = async (
  _req,
  { apiContext, params, body }
) => {
  const { userId, workspaceId } = apiContext;
  const assetId = params.assetId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const validation = publicAssetImportSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const { projectId, titleOverride } = validation.data;

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

  const asset = await prisma.publicAsset.findUnique({
    where: { id: assetId }
  });
  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  const result = await importPublicAssetToProject({
    asset,
    projectId,
    userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    titleOverride
  });

  return NextResponse.json({ resource: result }, { status: 201 });
};

export const POST = withAuth(importHandler);
