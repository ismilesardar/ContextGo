'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { BASE_URL } from '@/config/url.config';
import { authClient } from '@/lib/auth/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getDeleteWorkspaceSchema } from '../../utils/workspace-delete-schema';
import { useWorkspaceStore } from '@/store';
import { ActiveOrganization } from '@/lib/auth/auth';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';
import { useDeleteWorkspaceModal } from '@/components/ui/modal/delete-workspace-modal';

type WorkspaceDeleteSectionProps = {
  workspace: ActiveOrganization;
};

export const WorkspaceDeleteSection = ({
  workspace
}: WorkspaceDeleteSectionProps) => {
  const { hasPermission } = usePermissions();
  const { setShowDeleteWorkspaceModal, DeleteWorkspaceModal } =
    useDeleteWorkspaceModal();

  // Workspace permission
  const canDelete = hasPermission('organization', 'delete');

  if (!canDelete) {
    return null;
  }

  return (
    <>
      <DeleteWorkspaceModal />

      <Card className='rounded-xl border border-red-200 p-0'>
        <div className='relative flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Delete Workspace</h2>
            <p className='text-sm text-neutral-500'>
              Permanently delete your workspace, custom domain, and all
              associated links + their stats. This action cannot be undone -
              please proceed with caution.
            </p>
          </div>
        </div>
        <div className='flex items-center justify-end space-x-4 overflow-hidden rounded-b-lg border-t border-red-200 bg-red-50 px-6 py-3 dark:bg-red-700/10'>
          <div className='w-fit shrink-0'>
            <Button
              className='bg-red-500 hover:bg-red-400'
              variant='brand'
              size='lg'
              onClick={() => setShowDeleteWorkspaceModal(true)}
            >
              Delete Workspace
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};
