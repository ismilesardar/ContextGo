'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { profileSchema } from '../../utils/profile-schema';
import z from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/form-input';
import { APP_NAME } from '@/config/url.config';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { User } from 'better-auth/types';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

export const NameForm = ({
  user,
  refreshSession
}: {
  user: User;
  refreshSession: () => void;
}) => {
  const nameFormSchema = profileSchema.pick({
    name: true
  });

  type NameFormData = z.infer<typeof nameFormSchema>;

  const nameForm = useForm<NameFormData>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: user?.name || ''
    }
  });

  // Destructure isDirty from formState
  const { isDirty, isSubmitting } = nameForm.formState;

  // Optional: Sync form if user data arrives late
  useEffect(() => {
    if (user?.name) {
      nameForm.reset({ name: user.name });
    }
  }, [user?.name, nameForm]);

  const onSubmit = async (newName: NameFormData) => {
    const { error } = await authClient.updateUser(newName);

    if (error) {
      toast.error(error?.message || 'Something went wrong! try again letter.');
      return;
    }

    // Sync the form state with the new data
    nameForm.reset(newName);
    refreshSession();

    toast.success('Successfully update your name!');
  };

  return (
    <Card className='p-0'>
      <Form
        form={nameForm}
        onSubmit={nameForm.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='relative flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Your Name</h2>
            <p className='text-sm text-neutral-500'>
              This is your display name on {APP_NAME}.
            </p>
          </div>
          <FormInput
            control={nameForm.control}
            name='name'
            type='text'
            label=''
            autoComplete='name'
            placeholder='Enter your name'
            required
            className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
            labelClassName='text-lg'
          />
        </div>

        <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='text-sm text-neutral-500'>Max 32 characters.</p>
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
