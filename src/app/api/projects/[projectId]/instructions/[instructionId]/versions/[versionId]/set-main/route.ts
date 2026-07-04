/**
 * POST /api/projects/[projectId]/instructions/[instructionId]/versions/[versionId]/set-main
 * Repoints the Instruction's active/Main version at an existing InstructionVersion snapshot
 * and mirrors its content onto the live Instruction row (org owner/moderator only).
 * Does not change the version counter and does not create a new InstructionVersion —
 * unlike the old "restore" flow, this is a pointer move, not a new commit.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';

const setMainHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const instructionId = params.instructionId as string;
  const versionId = params.versionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const instruction = await prisma.instruction.findFirst({
    where: {
      id: instructionId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
  if (!instruction) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const targetVersion = await prisma.instructionVersion.findFirst({
    where: { id: versionId, instructionId }
  });
  if (!targetVersion) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }

  const updated = await prisma.instruction.update({
    where: { id: instructionId },
    data: {
      title: targetVersion.title,
      description: targetVersion.description,
      content: targetVersion.content,
      updatedById: userId,
      mainVersionId: targetVersion.id
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    }
  });

  return NextResponse.json({ instruction: updated });
};

export const POST = withAuth(setMainHandler);
