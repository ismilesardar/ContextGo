'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/form-input';
import { APP_NAME } from '@/config/url.config';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { activeWorkspaceSchema } from '../../utils/workspace-schema';
import { useWorkspaceStore } from '@/store';
import { createSlug } from '@/utils/create-slug';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';

export const WorkspaceSlugForm = () => {
  const { hasPermission } = usePermissions();

  const { activeWorkspace, addActiveWorkspace } = useWorkspaceStore(
    (state) => state
  );

  // Workspace permission
  const canUpdate = hasPermission('organization', 'update');

  const workspaceSlugSchema = activeWorkspaceSchema.pick({
    slug: true
  });

  // Extract the type from the schema
  type ActiveWorkspace = z.infer<typeof workspaceSlugSchema>;

  const workspaceSlugForm = useForm<ActiveWorkspace>({
    resolver: zodResolver(workspaceSlugSchema),
    defaultValues: {
      slug: activeWorkspace?.slug || ''
    }
  });

  // Destructure isDirty from formState
  const { isDirty, isSubmitting } = workspaceSlugForm.formState;

  // Optional: Sync form if user data arrives late
  useEffect(() => {
    if (activeWorkspace?.slug) {
      workspaceSlugForm.reset({ slug: activeWorkspace.slug });
    }
  }, [activeWorkspace?.slug, workspaceSlugForm]);

  const onSubmit = async (newSlugName: ActiveWorkspace) => {
    if (!canUpdate) {
      return toast.error('Unauthorized action!');
    }
    if (!activeWorkspace) return;

    const newSlug = createSlug(newSlugName.slug);

    // 1. Check if the slug exists
    const { data, error: checkSlugError } =
      await authClient.organization.checkSlug({
        slug: newSlug
      });

    if (checkSlugError) {
      toast.error(checkSlugError.message || 'Something went wrong!');
      if (checkSlugError.code === 'SLUG_IS_TAKEN') {
        workspaceSlugForm.setError('slug', {
          message: `The slug ${newSlug} is already taken.`
        });
      }
      return;
    }

    if (!data) {
      workspaceSlugForm.setError('slug', {
        message: `The slug ${newSlug} is already taken.`
      });
      return;
    }

    const { error } = await authClient.organization.update({
      data: { slug: newSlug },
      organizationId: activeWorkspace.id
    });

    if (error) {
      toast.error(
        error?.message || 'Workspace name update failed! try again letter.'
      );
      return;
    }

    // state update
    addActiveWorkspace({
      ...activeWorkspace,
      slug: newSlug
    });

    // Sync the form state with the new data
    workspaceSlugForm.reset({ slug: newSlug });
    // update user profile
    await authClient.updateUser({ defaultWorkspace: newSlug });

    // set active workspace name
    setActiveWorkspaceName(newSlug);

    toast.success('Successfully update workspace slug!');
    window.location.replace(`/${newSlug}/settings`);
  };

  return (
    <Card className='p-0'>
      <Form
        form={workspaceSlugForm}
        onSubmit={workspaceSlugForm.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='relative flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Workspace Slug</h2>
            <p className='text-sm text-neutral-500'>
              This is your workspace's unique slug on {APP_NAME}.
            </p>
          </div>
          <FormInput
            control={workspaceSlugForm.control}
            name='slug'
            type='text'
            label=''
            autoComplete='slug'
            placeholder='my-workspace'
            required
            disabled={!canUpdate}
            className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
            labelClassName='text-lg'
          />
        </div>

        <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='text-sm text-neutral-500'>
            Only lowercase letters, numbers, and dashes. Max 48 characters.
          </p>
          <div className='w-fit shrink-0'>
            {canUpdate && (
              <Button
                type='submit'
                disabled={!isDirty || isSubmitting}
                variant='brand'
                size='lg'
              >
                {isSubmitting && <Spinner />}
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Card>
  );
};
