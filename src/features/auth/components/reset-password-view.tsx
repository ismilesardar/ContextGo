'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/forms/form-input';
import BoxDesign from '@/components/layout/box-design';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { registerSchema } from '@/lib/zod-schema/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { Spinner } from '@/components/ui/spinner';

export const ResetPasswordView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  const resetPasswordSchema = registerSchema
    .pick({
      password: true
    })
    .extend({
      confirmPassword: z.string().min(1, 'Confirm Password is required')
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword']
    });

  type ResetFormData = z.infer<typeof resetPasswordSchema>;

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: ''
    }
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      toast.warning('Invalid or expired password reset link.');
      return;
    }

    // Here you would typically call your API to reset the password
    const { error } = await authClient.resetPassword({
      token,
      newPassword: data.password
    });

    if (error) {
      toast.error(error.message || 'Failed to reset password');
      return;
    }

    toast.success('Password reset successfully!');

    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  };

  if (token === null || error) {
    return (
      <BoxDesign boxSize={85} isFooter={false}>
        <div
          className='flex h-[calc(100vh-150px)] w-full flex-col items-center justify-center px-4'
          style={{
            opacity: 1
          }}
        >
          <div className='w-full max-w-sm'>
            <h3 className='text-center text-xl font-semibold'>
              Invalid or expired password reset link.
            </h3>
            <Button
              type='button'
              className='mt-8 h-14 w-full'
              variant='dash'
              asChild
            >
              <Link
                href='/auth/login'
                className='hover:text-neutral-600 hover:underline'
              >
                Go back to login
              </Link>
            </Button>
          </div>
        </div>
      </BoxDesign>
    );
  }

  return (
    <BoxDesign boxSize={85} isFooter={false}>
      <div
        className='flex h-[calc(100vh-150px)] w-full flex-col items-center justify-center px-4'
        style={{
          opacity: 1
        }}
      >
        <div className='w-full max-w-sm'>
          <h3 className='text-center text-xl font-semibold'>
            Reset your password
          </h3>
          <div className='mt-8'>
            <Form
              form={form}
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <div className='relative'>
                <FormInput
                  control={form.control}
                  name='password'
                  type='password'
                  label='New Password'
                  placeholder='xxxx - xxxx'
                  required
                  className='w-full max-w-md rounded-md border border-neutral-300 py-5 pr-3 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                  labelClassName='text-lg'
                />
              </div>

              <div className='relative'>
                <FormInput
                  control={form.control}
                  name='confirmPassword'
                  type='password'
                  label='Confirm Password'
                  placeholder='xxxx - xxxx'
                  required
                  className='w-full max-w-md rounded-md border border-neutral-300 py-5 pr-3 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                  labelClassName='text-lg'
                />
              </div>

              <div className='pt-4'>
                <Button
                  type='submit'
                  className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white'
                >
                  {isLoading && <Spinner />}
                  Reset Password
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </BoxDesign>
  );
};
