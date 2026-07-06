import crypto from 'crypto';
import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import {
  normalizeTemplateFile,
  CATEGORY_DEFAULT_RESOURCE_TYPE,
  type LibrarySourceCategory
} from './normalize-template';

const REPO = 'github/awesome-copilot';
const BRANCH = 'main';
const SOURCE = 'awesome-copilot';
const CONCURRENCY = 10;

const FLAT_CATEGORIES: Record<string, LibrarySourceCategory> = {
  instructions: 'instruction',
  agents: 'agent',
  workflows: 'workflow'
};

const BUNDLE_CATEGORIES: Record<string, LibrarySourceCategory> = {
  skills: 'skill',
  plugins: 'plugin',
  hooks: 'hook'
};

interface PendingItem {
  sourcePath: string;
  sourceCategory: LibrarySourceCategory;
  bundledFiles: string[];
}

export interface LibrarySyncSummary {
  scanned: number;
  upserted: number;
  skippedUnchanged: number;
  deleted: number;
  failed: number;
}

function pickPrimaryDoc(mdFiles: string[]): string {
  return (
    mdFiles.find((f) => f.toUpperCase().endsWith('/SKILL.MD')) ??
    mdFiles.find((f) => f.toUpperCase().endsWith('/README.MD')) ??
    [...mdFiles].sort()[0]
  );
}

/**
 * Groups the repo's flat file listing into importable "items": one row per
 * flat file (instructions/agents/workflows/cookbook), one row per bundle
 * folder for skills/plugins/hooks (picking a single primary doc per folder —
 * SKILL.md, else README.md, else the first markdown file found).
 */
function collectItems(blobPaths: string[]): PendingItem[] {
  const items: PendingItem[] = [];

  for (const [folder, category] of Object.entries(FLAT_CATEGORIES)) {
    blobPaths
      .filter(
        (p) =>
          p.startsWith(`${folder}/`) &&
          p.endsWith('.md') &&
          p.split('/').length === 2
      )
      .forEach((p) =>
        items.push({
          sourcePath: p,
          sourceCategory: category,
          bundledFiles: []
        })
      );
  }

  // cookbook recipes live nested under cookbook/<tool>/<lang>/*.md — the
  // top-level cookbook/README.md is an index, not a recipe, so it's excluded.
  blobPaths
    .filter(
      (p) =>
        p.startsWith('cookbook/') &&
        p.endsWith('.md') &&
        p.split('/').length > 2
    )
    .forEach((p) =>
      items.push({
        sourcePath: p,
        sourceCategory: 'cookbook',
        bundledFiles: []
      })
    );

  for (const [folder, category] of Object.entries(BUNDLE_CATEGORIES)) {
    const prefix = `${folder}/`;
    const groups = new Map<string, string[]>();

    blobPaths
      .filter((p) => p.startsWith(prefix))
      .forEach((p) => {
        const rest = p.slice(prefix.length);
        const itemFolder = rest.split('/')[0];
        if (!itemFolder) return;
        const key = `${prefix}${itemFolder}`;
        groups.set(key, [...(groups.get(key) ?? []), p]);
      });

    for (const files of groups.values()) {
      const mdFiles = files.filter((f) => f.endsWith('.md'));
      if (mdFiles.length === 0) continue; // no doc to import — skip the bundle
      const primary = pickPrimaryDoc(mdFiles);
      const bundledFiles = files.filter((f) => f !== primary);
      items.push({
        sourcePath: primary,
        sourceCategory: category,
        bundledFiles
      });
    }
  }

  return items;
}

async function mapWithConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = items[index++];
      await fn(current);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
}

export async function syncLibraryTemplates(): Promise<LibrarySyncSummary> {
  const githubToken = process.env.GITHUB_SYNC_TOKEN;
  const treeRes = await fetch(
    `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {})
      }
    }
  );
  if (!treeRes.ok) {
    if (
      treeRes.status === 403 &&
      treeRes.headers.get('x-ratelimit-remaining') === '0'
    ) {
      const resetAt = treeRes.headers.get('x-ratelimit-reset');
      const resetMessage = resetAt
        ? ` Resets at ${new Date(Number(resetAt) * 1000).toLocaleTimeString()}.`
        : '';
      throw new Error(
        `GitHub API rate limit exceeded while fetching awesome-copilot.${resetMessage} Set GITHUB_SYNC_TOKEN in your environment to raise the limit from 60/hr to 5,000/hr.`
      );
    }
    throw new Error(`Failed to fetch awesome-copilot tree: ${treeRes.status}`);
  }

  const treeJson = (await treeRes.json()) as {
    tree: { path: string; type: string }[];
  };
  const blobPaths = treeJson.tree
    .filter((entry) => entry.type === 'blob')
    .map((entry) => entry.path);

  const items = collectItems(blobPaths);
  const seenPaths = new Set<string>();
  let upserted = 0;
  let skippedUnchanged = 0;
  let failed = 0;

  await mapWithConcurrency(items, CONCURRENCY, async (item) => {
    // Marked "seen" before the fetch attempt so a transient failure on this
    // item doesn't cause its still-valid existing row to be deleted as stale.
    seenPaths.add(item.sourcePath);

    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${item.sourcePath}`
      );
      if (!rawRes.ok) return;
      const raw = await rawRes.text();
      const contentHash = crypto.createHash('sha256').update(raw).digest('hex');

      const existing = await prisma.libraryTemplate.findUnique({
        where: {
          source_sourcePath: { source: SOURCE, sourcePath: item.sourcePath }
        }
      });
      if (existing && existing.contentHash === contentHash) {
        skippedUnchanged += 1;
        return;
      }

      const normalized = normalizeTemplateFile({
        sourcePath: item.sourcePath,
        sourceCategory: item.sourceCategory,
        raw,
        bundledFiles: item.bundledFiles
      });

      const sharedData = {
        sourceCategory: item.sourceCategory,
        sourceUrl: `https://github.com/${REPO}/blob/${BRANCH}/${item.sourcePath}`,
        title: normalized.title,
        description: normalized.description,
        tags: normalized.tags,
        content: normalized.content,
        frontmatter: normalized.frontmatter as Prisma.InputJsonValue,
        contentHash,
        suggestedResourceType:
          CATEGORY_DEFAULT_RESOURCE_TYPE[item.sourceCategory]
      };

      await prisma.libraryTemplate.upsert({
        where: {
          source_sourcePath: { source: SOURCE, sourcePath: item.sourcePath }
        },
        create: { source: SOURCE, sourcePath: item.sourcePath, ...sharedData },
        update: sharedData
      });
      upserted += 1;
    } catch (error) {
      // One flaky fetch/parse shouldn't abort an otherwise-successful sync of
      // hundreds of independent items.
      failed += 1;
      console.error(
        `Library sync: failed to process ${item.sourcePath}`,
        error
      );
    }
  });

  let deleted = 0;
  if (seenPaths.size > 0) {
    const deleteResult = await prisma.libraryTemplate.deleteMany({
      where: { source: SOURCE, sourcePath: { notIn: Array.from(seenPaths) } }
    });
    deleted = deleteResult.count;
  }

  return { scanned: items.length, upserted, skippedUnchanged, deleted, failed };
}
