/**
 * GET /api/library/templates/[templateId] — full detail (including
 * content/frontmatter) for a single cached library template, used for the
 * preview modal. Open to any authenticated user.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';

const detailHandler: ApiHandler = async (_req, { params }) => {
  const templateId = params.templateId as string;

  const template = await prisma.libraryTemplate.findUnique({
    where: { id: templateId }
  });

  if (!template) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ template });
};

export const GET = withAuth(detailHandler);
