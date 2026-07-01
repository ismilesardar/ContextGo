'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_NAME } from '@/config/url.config';
import { toast } from 'sonner';
import z from 'zod';
import { changePasswordSchema } from '../../utils/change-password-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePasswordSection = () => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      revokeOtherSessions: true
    }
  });

  const { isDirty, isSubmitting } = form.formState;

  const onSubmit = async (data: ChangePasswordFormData) => {
    await authClient.changePassword(data, {
      onError: (error) => {
        toast.error(error.error.message || 'Failed to change password');
      },
      onSuccess: () => {
        toast.success('Password change successfully');
        form.reset();
      }
    });
  };

  return (
    <Card className='p-0'>
      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Password</h2>
            <p className='text-sm text-neutral-500'>
              Manage your account password on {APP_NAME}.
            </p>
          </div>
          <Card className='max-w-md border-none p-0'>
            <div className='relative'>
              <FormInput
                control={form.control}
                name='currentPassword'
                type='password'
                label='Current Password'
                placeholder=''
                required
                className='w-full max-w-md rounded-md border border-neutral-300 py-5 pr-3 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                labelClassName='text-lg'
              />
            </div>
            <div className='relative'>
              <FormInput
                control={form.control}
                name='newPassword'
                type='password'
                label='New Password'
                placeholder=''
                required
                className='w-full max-w-md rounded-md border border-neutral-300 py-5 pr-3 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                labelClassName='text-lg'
              />
            </div>
          </Card>
        </div>

        <div className='flex flex-col items-start justify-end gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
          <div className='w-fit shrink-0'>
            <Button
              type='submit'
              disabled={!isDirty || isSubmitting}
              variant='brand'
              size='lg'
            >
              {isSubmitting && <Spinner />}
              Update Password
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};
