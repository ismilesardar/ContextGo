/**
 * GET    /api/projects/[projectId]/skills/[skillId] — fetch a Skill (any access required)
 * PATCH  /api/projects/[projectId]/skills/[skillId] — update fields, or publish/unpublish via { status } (org owner/moderator only).
 *        A title/description/content edit always creates a new SkillVersion snapshot, but never
 *        auto-promotes it to Main — the live row's content/mainVersionId are unchanged until the
 *        user explicitly calls the set-main endpoint.
 * DELETE /api/projects/[projectId]/skills/[skillId] — permanent delete (org owner/moderator only)
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
import { skillSchema } from '@/lib/zod-schema/skill-schema';

const updateBodySchema = z.union([
  z.object({ status: z.enum(['draft', 'published']) }),
  skillSchema.partial()
]);

async function loadSkill(
  skillId: string,
  projectId: string,
  workspaceId: string
) {
  return prisma.skill.findFirst({
    where: {
      id: skillId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
}

const getHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const skillId = params.skillId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const skill = await prisma.skill.findFirst({
    where: {
      id: skillId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    }
  });
  if (!skill) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ skill });
};

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const skillId = params.skillId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadSkill(skillId, projectId, workspaceId);
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
    const skill = await prisma.skill.update({
      where: { id: skillId },
      data: { status: data.status, updatedById: userId },
      include: {
        createdBy: { select: AUTHOR_SELECT },
        updatedBy: { select: AUTHOR_SELECT },
        mainVersion: { select: { id: true, version: true } }
      }
    });
    return NextResponse.json({ skill });
  }

  const nextVersion = existing.version + 1;

  // Every edit is captured as a new SkillVersion snapshot, but it does not
  // become the live/Main version automatically — the live Skill row (title,
  // description, content, mainVersionId) is left untouched. The user must
  // explicitly promote a version via the set-main endpoint.
  const skill = await prisma.$transaction(async (tx) => {
    await tx.skillVersion.create({
      data: {
        skillId,
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

    return tx.skill.update({
      where: { id: skillId },
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

  return NextResponse.json({ skill });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const skillId = params.skillId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadSkill(skillId, projectId, workspaceId);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.skill.delete({ where: { id: skillId } });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
