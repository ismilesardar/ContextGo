/**
 * GET    /api/projects/[projectId]/instructions/[instructionId] — fetch a Instruction (any access required)
 * PATCH  /api/projects/[projectId]/instructions/[instructionId] — update fields, or publish/unpublish via { status } (org owner/moderator only).
 *        A title/description/content edit always creates a new InstructionVersion snapshot, but never
 *        auto-promotes it to Main — the live row's content/mainVersionId are unchanged until the
 *        user explicitly calls the set-main endpoint.
 * DELETE /api/projects/[projectId]/instructions/[instructionId] — permanent delete (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { instructionSchema } from '@/lib/zod-schema/instruction-schema';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const updateBodySchema = z.union([
  z.object({ status: z.enum(['draft', 'published']) }),
  instructionSchema.partial()
]);

async function loadInstruction(
  instructionId: string,
  projectId: string,
  workspaceId: string
) {
  return prisma.instruction.findFirst({
    where: {
      id: instructionId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
}

const getHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const instructionId = params.instructionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const instruction = await prisma.instruction.findFirst({
    where: {
      id: instructionId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    }
  });
  if (!instruction) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ instruction });
};

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const instructionId = params.instructionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadInstruction(instructionId, projectId, workspaceId);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = updateBodySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;

  if ('status' in data) {
    const instruction = await prisma.instruction.update({
      where: { id: instructionId },
      data: { status: data.status, updatedById: userId },
      include: {
        createdBy: { select: AUTHOR_SELECT },
        updatedBy: { select: AUTHOR_SELECT },
        mainVersion: { select: { id: true, version: true } }
      }
    });

    await recordProjectActivity({
      projectId,
      actorId: userId,
      actorName: apiContext.session.user.name ?? 'Unknown',
      action:
        data.status === 'published'
          ? 'instruction.published'
          : 'instruction.unpublished',
      resourceType: 'instruction',
      resourceId: instructionId,
      resourceTitle: instruction.title
    });

    return NextResponse.json({ instruction });
  }

  const nextVersion = existing.version + 1;

  // Every edit is captured as a new InstructionVersion snapshot, but it does not
  // become the live/Main version automatically — the live Instruction row (title,
  // description, content, mainVersionId) is left untouched. The user must
  // explicitly promote a version via the set-main endpoint.
  const instruction = await prisma.$transaction(async (tx) => {
    await tx.instructionVersion.create({
      data: {
        instructionId,
        version: nextVersion,
        title: data.title ?? existing.title,
        description:
          data.description !== undefined
            ? data.description
            : existing.description,
        content: data.content ?? existing.content,
        createdById: userId
      }
    });

    return tx.instruction.update({
      where: { id: instructionId },
      data: {
        updatedById: userId,
        version: nextVersion
      },
      include: {
        createdBy: { select: AUTHOR_SELECT },
        updatedBy: { select: AUTHOR_SELECT },
        mainVersion: { select: { id: true, version: true } }
      }
    });
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'instruction.updated',
    resourceType: 'instruction',
    resourceId: instructionId,
    resourceTitle: instruction.title
  });

  return NextResponse.json({ instruction });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const instructionId = params.instructionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadInstruction(instructionId, projectId, workspaceId);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.instruction.delete({ where: { id: instructionId } });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'instruction.deleted',
    resourceType: 'instruction',
    resourceId: instructionId,
    resourceTitle: existing.title
  });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
