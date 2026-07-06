'use client';

import { Dispatch, SetStateAction } from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RichTextViewer } from '@/components/editor/rich-text-viewer';
import { CATEGORY_LABELS } from '../utils/library-copy';
import {
  useLibraryTemplate,
  type LibraryTemplateSummary
} from '../utils/use-library-templates';

export function TemplatePreviewModal({
  template,
  showModal,
  setShowModal,
  onUse
}: {
  template: LibraryTemplateSummary;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onUse: () => void;
}) {
  const { data: detail, isLoading } = useLibraryTemplate(
    showModal ? template.id : undefined
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
            <h3 className='text-lg font-medium'>{template.title}</h3>
            <Badge variant='outline'>
              {CATEGORY_LABELS[template.sourceCategory]}
            </Badge>
          </div>
          {template.description && (
            <p className='text-sm text-neutral-500'>{template.description}</p>
          )}
          <a
            href={template.sourceUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary text-xs underline underline-offset-2'
          >
            View source on GitHub
          </a>
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
            Use this template
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
