import matter from 'gray-matter';

export type LibrarySourceCategory =
  | 'instruction'
  | 'agent'
  | 'skill'
  | 'workflow'
  | 'cookbook'
  | 'plugin'
  | 'hook';

export type LibraryResourceType =
  | 'context'
  | 'instruction'
  | 'skill'
  | 'promptTemplate'
  | 'checklist';

// Default target resource type suggested at import time — always overridable
// by the user in the import form, never a hard mapping.
export const CATEGORY_DEFAULT_RESOURCE_TYPE: Record<
  LibrarySourceCategory,
  LibraryResourceType
> = {
  instruction: 'instruction',
  skill: 'skill',
  agent: 'promptTemplate',
  workflow: 'skill',
  hook: 'skill',
  cookbook: 'promptTemplate',
  plugin: 'context'
};

export interface NormalizedTemplate {
  title: string;
  description?: string;
  tags: string[];
  content: string;
  frontmatter: Record<string, unknown>;
}

function humanize(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveTitle(
  sourcePath: string,
  data: Record<string, unknown>,
  body: string
): string {
  if (typeof data.name === 'string' && data.name.trim()) {
    return humanize(data.name.trim());
  }
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();

  const filename = sourcePath.split('/').pop() ?? sourcePath;
  const base = filename
    .replace(/\.(instructions|agent)\.md$/i, '')
    .replace(/\.md$/i, '');
  return humanize(base);
}

function deriveDescription(data: Record<string, unknown>): string | undefined {
  const raw = data.description ?? data.summary;
  if (typeof raw === 'string' && raw.trim()) return raw.trim().slice(0, 500);
  return undefined;
}

function deriveTags(
  data: Record<string, unknown>,
  sourceCategory: LibrarySourceCategory
): string[] {
  const tags = new Set<string>([sourceCategory]);

  const applyTo = data.applyTo;
  if (typeof applyTo === 'string') {
    applyTo.split(',').forEach((raw) => {
      const cleaned = raw
        .trim()
        .replace(/^\*+\/?/, '')
        .replace(/\*/g, '')
        .replace(/^\./, '');
      const value = cleaned.split('.').pop()?.trim();
      if (value) tags.add(value.toLowerCase());
    });
  }

  if (Array.isArray(data.tags)) {
    data.tags.forEach((tag) => {
      if (typeof tag === 'string' && tag.trim())
        tags.add(tag.trim().toLowerCase());
    });
  }

  return Array.from(tags).slice(0, 10);
}

/**
 * Normalizes a single raw markdown file (with optional YAML frontmatter) from
 * any of the 7 awesome-copilot source categories into the common shape cached
 * in `LibraryTemplate`. Every field beyond the body content is
 * best-effort — different categories don't share a confirmed frontmatter
 * schema, so nothing here assumes a field exists.
 */
export function normalizeTemplateFile(params: {
  sourcePath: string;
  sourceCategory: LibrarySourceCategory;
  raw: string;
  bundledFiles?: string[];
}): NormalizedTemplate {
  const { sourcePath, sourceCategory, raw, bundledFiles } = params;
  const parsed = matter(raw);
  const data = (parsed.data ?? {}) as Record<string, unknown>;
  const body = parsed.content.trim();

  const frontmatter: Record<string, unknown> = { ...data };
  if (bundledFiles && bundledFiles.length > 0) {
    frontmatter.bundledFiles = bundledFiles;
  }

  return {
    title: deriveTitle(sourcePath, data, body),
    description: deriveDescription(data),
    tags: deriveTags(data, sourceCategory),
    content: body,
    frontmatter
  };
}
