'use client';

import { Dispatch, SetStateAction } from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RichTextViewer } from '@/components/editor/rich-text-viewer';
import { RESOURCE_TYPE_LABELS } from '../../utils/library-copy';
import {
  usePublicAsset,
  type PublicAssetSummary
} from '../../utils/use-public-assets';

export function PublicAssetPreviewModal({
  asset,
  showModal,
  setShowModal,
  onUse
}: {
  asset: PublicAssetSummary;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onUse: () => void;
}) {
  const { data: detail, isLoading } = usePublicAsset(
    showModal ? asset.id : undefined
  );

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-2xl'
    >
      <div className='flex max-h-[80vh] flex-col'>
        <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-lg font-medium'>{asset.title}</h3>
            <Badge variant='outline'>
              {RESOURCE_TYPE_LABELS[asset.resourceType]}
            </Badge>
          </div>
          {asset.description && (
            <p className='text-sm text-neutral-500'>{asset.description}</p>
          )}
          <p className='text-muted-foreground text-xs'>
            Published by {asset.createdBy.name}
          </p>
        </div>

        <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
          {isLoading || !detail ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
              <Skeleton className='h-4 w-2/3' />
            </div>
          ) : (
            <RichTextViewer content={detail.content} />
          )}
        </div>

        <div className='flex justify-end gap-2 border-t border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
          <Button variant='outline' onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              setShowModal(false);
              onUse();
            }}
          >
            Use this asset
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
