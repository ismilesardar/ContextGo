'use client';

import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { CustomModal } from '../custom-model';
import { useUserSession } from '@/hooks/use-client-session';
import { Button } from '../button';
import { Spinner } from '../spinner';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { authClient } from '@/lib/auth/auth-client';
import { FormInput } from '@/components/forms/form-input';
import { Form } from '../form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDeleteWorkspaceSchema } from '@/features/workspace/utils/workspace-delete-schema';
import { useWorkspaceStore } from '@/store';
import { BASE_URL } from '@/config/url.config';
import { toast } from 'sonner';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';
import { cn } from '@/lib/utils';

function DeleteWorkspaceModal({
  showDeleteWorkspaceModal,
  setShowDeleteWorkspaceModal
}: {
  showDeleteWorkspaceModal: boolean;
  setShowDeleteWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { user, refreshSession } = useUserSession();
  const { hasPermission } = usePermissions();
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  const workspaceDeleteForm = useForm({
    resolver: zodResolver(
      getDeleteWorkspaceSchema(activeWorkspace?.slug || '')
    ),
    defaultValues: {
      slug: '',
      phrase: ''
    },
    mode: 'onChange'
  });

  const { isSubmitting, isValid } = workspaceDeleteForm.formState;

  const handleDelete = async (data: any) => {
    if (!isValid || !activeWorkspace || !user) return;

    const { error } = await authClient.organization.delete({
      organizationId: activeWorkspace.id
    });

    if (error) {
      toast.error(error.message || 'Something went wrong!');
      return;
    }
    // refresh session
    refreshSession();

    toast.success('Workspace delete successfully!');

    const { data: workspaces } = await authClient.organization.list();

    if (!workspaces?.length) {
      await authClient.updateUser({ defaultWorkspace: null });
      router.push('/onboarding/workspace');
      return;
    }

    const hasDefaultWorkspace = workspaces.some(
      (workspace) => workspace.slug === user?.defaultWorkspace
    );

    if (hasDefaultWorkspace && user.defaultWorkspace) {
      await authClient.organization.setActive({
        organizationSlug: user.defaultWorkspace
      });

      setActiveWorkspaceName(user.defaultWorkspace);
      return router.push(`/${user?.defaultWorkspace}`);
    } else {
      const firstOneWorkspace = workspaces[0];
      try {
        await authClient.organization.setActive({
          organizationId: firstOneWorkspace.id
        });

        setActiveWorkspaceName(firstOneWorkspace.slug);
        return router.push(`/${firstOneWorkspace.slug}`);
      } catch (error) {
        await authClient.updateUser({ defaultWorkspace: null });
        return router.push('/onboarding/workspace');
      }
    }
  };

  // Workspace permission
  const canDelete = hasPermission('organization', 'delete');

  if (!canDelete) {
    return null;
  }

  return (
    <CustomModal
      showModal={showDeleteWorkspaceModal}
      setShowModal={setShowDeleteWorkspaceModal}
      className='md:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6'>
        <h3 className='text-lg font-medium'>Delete Workspace</h3>
        <p className='text-sm text-neutral-500'>
          Warning: This will permanently delete your workspace, custom domains,
          and all associated links and their respective analytics.
        </p>
      </div>

      <Form
        form={workspaceDeleteForm}
        onSubmit={workspaceDeleteForm.handleSubmit(handleDelete)}
        className='space-y-6 px-4 py-4 sm:px-6'
      >
        <div className='relative flex items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-2 dark:border-neutral-600 dark:bg-neutral-900'>
          <UserAvatarProfile
            user={{
              imageUrl: activeWorkspace?.logo || '/assets/avatars/workspace.png'
            }}
            className='size-7 flex-1'
          />

          <div className='flex flex-1 flex-col gap-0.5'>
            <h3 className='line-clamp-1 text-sm font-medium text-neutral-600 dark:text-neutral-400'>
              {activeWorkspace?.name}
            </h3>
            <p className='text-xs font-medium text-neutral-500'>
              {BASE_URL}/{activeWorkspace?.slug}
            </p>
          </div>
        </div>
        {/* Field 1: The Slug */}
        <div className='space-y-2'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            Enter the workspace slug{' '}
            <span className='font-semibold dark:text-neutral-200'>
              {activeWorkspace?.slug}
            </span>{' '}
            to continue:
          </p>
          <FormInput
            control={workspaceDeleteForm.control}
            name='slug'
            type='text'
            placeholder=''
            className='w-full rounded-md border border-neutral-300 py-3 focus:ring-red-500 md:max-w-md'
          />
        </div>

        {/* Field 2: The Confirmation Phrase */}
        <div className='space-y-2'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            To verify, type{' '}
            <span className='font-semibold dark:text-neutral-200'>
              confirm delete workspace
            </span>{' '}
            below
          </p>
          <FormInput
            control={workspaceDeleteForm.control}
            name='phrase'
            type='text'
            placeholder=''
            className='w-full rounded-md border border-neutral-300 py-3 focus:ring-red-500 md:max-w-md'
          />
        </div>

        {canDelete && (
          <Button
            type='submit'
            disabled={isSubmitting || !isValid} // Button only works if typed correctly
            variant={isValid ? 'destructive' : 'outline'}
            className={cn(
              'w-full',
              isValid ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
          >
            {isSubmitting && <Spinner />}
            Delete
          </Button>
        )}
      </Form>
    </CustomModal>
  );
}

export function useDeleteWorkspaceModal() {
  const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] =
    useState(false);

  const DeleteWorkspaceModalCallback = useCallback(() => {
    return (
      <DeleteWorkspaceModal
        showDeleteWorkspaceModal={showDeleteWorkspaceModal}
        setShowDeleteWorkspaceModal={setShowDeleteWorkspaceModal}
      />
    );
  }, [showDeleteWorkspaceModal]);

  return useMemo(
    () => ({
      setShowDeleteWorkspaceModal,
      DeleteWorkspaceModal: DeleteWorkspaceModalCallback
    }),
    [DeleteWorkspaceModalCallback]
  );
}
