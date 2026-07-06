'use client';

import { useState } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { PageShell } from '@/components/layout/page-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { useUserSession } from '@/hooks/use-client-session';
import { ACCESS_TYPE } from '@/utils/constants/organization-const';
import {
  CATEGORY_LABELS,
  type LibrarySourceCategory
} from '../utils/library-copy';
import {
  useLibraryTemplates,
  useSyncLibrary,
  type LibraryTemplateSummary
} from '../utils/use-library-templates';
import { TemplateCard } from './template-card';
import { TemplatePreviewModal } from './template-preview-modal';
import { useImportTemplateModal } from './import-template-modal';

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [
  LibrarySourceCategory,
  string
][];

const PAGE_SIZE = 24;

export function LibraryView({ workspaceSlug }: { workspaceSlug: string }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [category, setCategory] = useState<LibrarySourceCategory | 'all'>(
    'all'
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [previewTemplate, setPreviewTemplate] =
    useState<LibraryTemplateSummary | null>(null);

  const { user } = useUserSession();
  const isSystemAdmin = user?.accessType === ACCESS_TYPE.SYSTEM;

  const { data, isLoading, isError, refetch } = useLibraryTemplates({
    search: debouncedSearch || undefined,
    category: category === 'all' ? undefined : category,
    page,
    pageSize: PAGE_SIZE
  });

  const templates = data?.templates;
  const totalPages = data?.totalPages ?? 1;

  function resetToFirstPage() {
    if (page !== 1) setPage(1);
  }

  const syncLibrary = useSyncLibrary();
  const { openImportModal, ImportTemplateModal } = useImportTemplateModal({
    workspaceSlug
  });

  return (
    <PageShell
      title='Library'
      description='Import ready-made instructions, skills, and prompts from the community into any of your projects.'
      showDate={false}
      actions={
        isSystemAdmin && (
          <Button
            variant='outline'
            onClick={() => syncLibrary.mutate()}
            disabled={syncLibrary.isPending}
          >
            {syncLibrary.isPending && <Spinner className='mr-2' />}
            Sync now
          </Button>
        )
      }
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Input
          placeholder='Search templates...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetToFirstPage();
          }}
          className='max-w-sm'
        />
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value as LibrarySourceCategory | 'all');
            resetToFirstPage();
          }}
        >
          <SelectTrigger className='w-44'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All categories</SelectItem>
            {CATEGORY_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/80 p-16 text-center dark:border-red-900 dark:bg-red-950/50'>
          <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50'>
            <IconAlertCircle className='size-6 text-red-600 dark:text-red-400' />
          </div>
          <p className='text-foreground text-lg font-semibold'>
            Unable to load
          </p>
          <p className='text-muted-foreground mt-1.5 text-sm'>
            Something went wrong. Please try again.
          </p>
          <Button onClick={() => refetch()} variant='outline' className='mt-5'>
            <IconRefresh className='mr-2 size-4' />
            Try again
          </Button>
        </div>
      ) : isLoading && !templates ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='bg-muted h-40 animate-pulse rounded-2xl' />
          ))}
        </div>
      ) : !templates || templates.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
          <p className='text-muted-foreground text-sm'>
            No templates found yet. Try a different search, or check back after
            the next sync.
          </p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={() => setPreviewTemplate(template)}
                onUse={() => openImportModal(template)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    aria-disabled={page <= 1}
                    className={
                      page <= 1 ? 'pointer-events-none opacity-50' : ''
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (pageNumber) =>
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - page) <= 1
                  )
                  .map((pageNumber, index, pages) => (
                    <PaginationItem key={pageNumber}>
                      {index > 0 && pages[index - 1] !== pageNumber - 1 && (
                        <span className='text-muted-foreground px-2 text-sm'>
                          ...
                        </span>
                      )}
                      <PaginationLink
                        href='#'
                        isActive={pageNumber === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    aria-disabled={page >= totalPages}
                    className={
                      page >= totalPages ? 'pointer-events-none opacity-50' : ''
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          showModal={true}
          setShowModal={() => setPreviewTemplate(null)}
          onUse={() => openImportModal(previewTemplate)}
        />
      )}

      <ImportTemplateModal />
    </PageShell>
  );
}
