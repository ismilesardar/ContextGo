'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { profileSchema } from '../../utils/profile-schema';
import z from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { User } from '@/lib/auth/auth';
import { SearchableSelect } from '@/components/forms/search-able-select';

export const WorkspaceForm = ({ user }: { user: User }) => {
  const { data: organizations } = authClient.useListOrganizations();

  const workspaceFormSchema = profileSchema.pick({
    defaultWorkspace: true
  });

  type WorkspaceFormData = z.infer<typeof workspaceFormSchema>;

  const workspaceForm = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      defaultWorkspace: user?.defaultWorkspace || undefined
    }
  });

  // Destructure isDirty from formState
  const { isDirty, isSubmitting } = workspaceForm.formState;

  // Optional: Sync form if user data arrives late
  useEffect(() => {
    if (user?.defaultWorkspace) {
      workspaceForm.reset({ defaultWorkspace: user.defaultWorkspace });
    }
  }, [user?.defaultWorkspace, workspaceForm]);

  const onSubmit = async (newWorkspace: WorkspaceFormData) => {
    const { error } = await authClient.updateUser(newWorkspace);

    if (error) {
      toast.error(error?.message || 'Something went wrong! try again letter.');
      return;
    }

    // Sync the form state with the new data
    workspaceForm.reset(newWorkspace);

    toast.success('Successfully update your workspace name!');
  };

  const organizationsOptions =
    organizations?.map((workspace) => ({
      label: workspace.name,
      value: workspace.slug
    })) || [];

  return (
    <Card className='p-0'>
      <Form
        form={workspaceForm}
        onSubmit={workspaceForm.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='relative flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Your Default Workspace</h2>
            <p className='text-sm text-neutral-500'>
              Choose the workspace to show by default when you sign in.
            </p>
          </div>
          <SearchableSelect
            control={workspaceForm.control}
            options={organizationsOptions}
            name='defaultWorkspace'
            label=''
            placeholder='Enter workspace name'
            required
            className='w-full max-w-md rounded-md border border-neutral-200 text-xl placeholder-neutral-400 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
          />
        </div>

        <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='text-sm text-neutral-500'>Set default workspaces.</p>
          <div className='w-fit shrink-0'>
            <Button
              type='submit'
              disabled={!isDirty || isSubmitting}
              variant='brand'
              size='lg'
            >
              {isSubmitting && <Spinner />}
              Save Changes
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};
