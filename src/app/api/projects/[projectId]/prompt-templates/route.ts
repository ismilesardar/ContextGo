/**
 * GET  /api/projects/[projectId]/prompt-templates — list PromptTemplates in a project (any access required)
 * POST /api/projects/[projectId]/prompt-templates — create a PromptTemplate (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { promptTemplateSchema } from '@/lib/zod-schema/prompt-template-schema';
import { createSlug } from '@/utils/create-slug';

async function loadProject(projectId: string, workspaceId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
}

async function uniquePromptTemplateSlug(projectId: string, base: string) {
  let slug = base;
  let suffix = 1;
  while (
    await prisma.promptTemplate.findUnique({
      where: { projectId_slug: { projectId, slug } }
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

const listHandler: ApiHandler = async (
  _req,
  { apiContext, params, searchParams }
) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await loadProject(projectId, workspaceId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const promptTemplates = await prisma.promptTemplate.findMany({
    where: {
      projectId,
      ...(status ? { status } : {}),
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
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json({ promptTemplates });
};

const createHandler: ApiHandler = async (
  _req,
  { apiContext, params, body }
) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await loadProject(projectId, workspaceId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = promptTemplateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const baseSlug = createSlug(validation.data.title) || 'promptTemplate';
  const slug = await uniquePromptTemplateSlug(projectId, baseSlug);

  const promptTemplate = await prisma.$transaction(async (tx) => {
    const created = await tx.promptTemplate.create({
      data: {
        ...validation.data,
        projectId,
        slug,
        createdById: userId,
        updatedById: userId
      }
    });

    const v1 = await tx.promptTemplateVersion.create({
      data: {
        promptTemplateId: created.id,
        version: created.version,
        title: created.title,
        description: created.description,
        content: created.content,
        createdById: userId
      }
    });

    return tx.promptTemplate.update({
      where: { id: created.id },
      data: { mainVersionId: v1.id },
      include: {
        createdBy: { select: AUTHOR_SELECT },
        updatedBy: { select: AUTHOR_SELECT },
        mainVersion: { select: { id: true, version: true } }
      }
    });
  });

  return NextResponse.json({ promptTemplate }, { status: 201 });
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
