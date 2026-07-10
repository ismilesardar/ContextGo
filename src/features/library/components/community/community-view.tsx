'use client';

import { useState } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import {
  RESOURCE_TYPE_OPTIONS,
  type LibraryResourceType
} from '../../utils/library-copy';
import {
  usePublicAssets,
  type PublicAssetSummary
} from '../../utils/use-public-assets';
import { PublicAssetCard } from './public-asset-card';
import { PublicAssetPreviewModal } from './public-asset-preview-modal';
import { usePublicAssetFormModal } from './public-asset-form-modal';
import { usePublicAssetImportModal } from './public-asset-import-modal';
import { useDeletePublicAssetModal } from './delete-public-asset-modal';

const PAGE_SIZE = 24;

export function CommunityView({ workspaceSlug }: { workspaceSlug: string }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [resourceType, setResourceType] = useState<LibraryResourceType | 'all'>(
    'all'
  );
  const [page, setPage] = useQueryState(
    'communityPage',
    parseAsInteger.withDefault(1)
  );
  const [previewAsset, setPreviewAsset] = useState<PublicAssetSummary | null>(
    null
  );

  const { user } = useUserSession();

  const { data, isLoading, isError, refetch } = usePublicAssets({
    search: debouncedSearch || undefined,
    resourceType: resourceType === 'all' ? undefined : resourceType,
    page,
    pageSize: PAGE_SIZE
  });

  const assets = data?.assets;
  const totalPages = data?.totalPages ?? 1;

  function resetToFirstPage() {
    if (page !== 1) setPage(1);
  }

  const { openCreateModal, openEditModal, PublicAssetFormModal } =
    usePublicAssetFormModal();
  const { openImportModal, PublicAssetImportModal } = usePublicAssetImportModal(
    { workspaceSlug }
  );
  const { openDeleteModal, DeletePublicAssetModal } =
    useDeletePublicAssetModal();

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 flex-col gap-4 sm:flex-row sm:items-center'>
          <Input
            placeholder='Search public assets...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className='max-w-sm'
          />
          <Select
            value={resourceType}
            onValueChange={(value) => {
              setResourceType(value as LibraryResourceType | 'all');
              resetToFirstPage();
            }}
          >
            <SelectTrigger className='w-44'>
              <SelectValue placeholder='Resource type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All types</SelectItem>
              {RESOURCE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreateModal}>Publish asset</Button>
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
      ) : isLoading && !assets ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='bg-muted h-40 animate-pulse rounded-2xl' />
          ))}
        </div>
      ) : !assets || assets.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
          <p className='text-muted-foreground text-sm'>
            No public assets yet. Be the first to publish one for the community.
          </p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {assets.map((asset) => (
              <PublicAssetCard
                key={asset.id}
                asset={asset}
                currentUserId={user?.id}
                onPreview={() => setPreviewAsset(asset)}
                onUse={() => openImportModal(asset)}
                onEdit={() => openEditModal(asset)}
                onDelete={() => openDeleteModal(asset)}
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

      {previewAsset && (
        <PublicAssetPreviewModal
          asset={previewAsset}
          showModal={true}
          setShowModal={() => setPreviewAsset(null)}
          onUse={() => openImportModal(previewAsset)}
        />
      )}

      <PublicAssetFormModal />
      <PublicAssetImportModal />
      <DeletePublicAssetModal />
    </div>
  );
}
