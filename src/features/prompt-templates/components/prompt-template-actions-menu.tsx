'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useDeletePromptTemplateModal } from './delete-prompt-template-modal';
import {
  usePublishPromptTemplate,
  type PromptTemplate
} from '../utils/use-prompt-templates';

export function PromptTemplateActionsMenu({
  promptTemplate,
  workspaceSlug,
  projectId
}: {
  promptTemplate: PromptTemplate;
  workspaceSlug: string;
  projectId: string;
}) {
  const publishPromptTemplate = usePublishPromptTemplate(
    projectId,
    promptTemplate.id
  );
  const { setShowDeletePromptTemplateModal, DeletePromptTemplateModal } =
    useDeletePromptTemplateModal({ promptTemplate, workspaceSlug, projectId });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 shrink-0'
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.dots className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem asChild>
            <Link
              href={`/${workspaceSlug}/projects/${projectId}/prompt-templates/${promptTemplate.id}`}
            >
              Open
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              publishPromptTemplate.mutate(
                promptTemplate.status === 'published' ? 'draft' : 'published'
              )
            }
          >
            {promptTemplate.status === 'published' ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setShowDeletePromptTemplateModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePromptTemplateModal />
    </>
  );
}
