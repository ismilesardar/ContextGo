'use client';

import z from 'zod';
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/form-input';
import { APP_NAME } from '@/config/url.config';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

import { activeWorkspaceSchema } from '../../utils/workspace-schema';
import { useWorkspaceStore } from '@/store';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';

export const WorkspaceNameForm = () => {
  const { hasPermission } = usePermissions();
  const { activeWorkspace, addActiveWorkspace, activeMember } =
    useWorkspaceStore((state) => state);

  // Workspace permission
  const canUpdate = hasPermission('organization', 'update');

  const workspaceNameSchema = activeWorkspaceSchema.pick({
    name: true
  });

  // Extract the type from the schema
  type ActiveWorkspace = z.infer<typeof workspaceNameSchema>;

  const workspaceNameForm = useForm<ActiveWorkspace>({
    resolver: zodResolver(workspaceNameSchema),
    defaultValues: {
      name: activeWorkspace?.name || ''
    }
  });

  // Destructure isDirty from formState
  const { isDirty, isSubmitting } = workspaceNameForm.formState;

  // Optional: Sync form if user data arrives late
  useEffect(() => {
    if (activeWorkspace?.name) {
      workspaceNameForm.reset({ name: activeWorkspace.name });
    }
  }, [activeWorkspace?.name, workspaceNameForm]);

  const onSubmit = async (newName: ActiveWorkspace) => {
    if (!canUpdate) {
      return toast.error('Unauthorized action!');
    }
    if (!activeWorkspace) return;

    const { error } = await authClient.organization.update({
      data: newName,
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
      name: newName.name
    });

    // Sync the form state with the new data
    workspaceNameForm.reset(newName);

    toast.success('Successfully update workspace name!');
  };

  return (
    <Card className='p-0'>
      <Form
        form={workspaceNameForm}
        onSubmit={workspaceNameForm.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='relative flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Workspace Name</h2>
            <p className='text-sm text-neutral-500'>
              This is the name of your workspace on {APP_NAME}.
            </p>
          </div>
          <FormInput
            control={workspaceNameForm.control}
            name='name'
            type='text'
            label=''
            autoComplete='name'
            placeholder='My Workspace'
            required
            disabled={!canUpdate}
            className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
            labelClassName='text-lg'
          />
        </div>

        <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='text-sm text-neutral-500'>Max 32 characters.</p>
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
