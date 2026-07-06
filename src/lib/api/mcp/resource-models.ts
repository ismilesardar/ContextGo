import prisma from '@/lib/prisma';

export const CONTENT_RESOURCE_TYPES = [
  'context',
  'instruction',
  'skill',
  'prompt_template',
  'checklist'
] as const;

export type ContentResourceType = (typeof CONTENT_RESOURCE_TYPES)[number];

export const RESOURCE_MODELS = {
  context: () => prisma.context,
  instruction: () => prisma.instruction,
  skill: () => prisma.skill,
  prompt_template: () => prisma.promptTemplate,
  checklist: () => prisma.checklist
} as const;

/**
 * Serializes a content resource row for MCP responses. Once a resource has a Main
 * version, that snapshot's title/description/content is what's served — never the
 * live row's own fields directly — since an unpromoted edit can leave the live row
 * ahead of Main (matches what the in-app viewer already shows via its own
 * `mainVersion?.version ?? version` fallback).
 */
export function serializeContentResource(
  resourceType: ContentResourceType,
  row: any
) {
  const main = row.mainVersion;
  return {
    id: row.id,
    resourceType,
    title: main?.title ?? row.title,
    slug: row.slug,
    description:
      main?.description !== undefined ? main.description : row.description,
    content: main?.content ?? row.content,
    version: main?.version ?? row.version,
    updatedAt: row.updatedAt
  };
}
