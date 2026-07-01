'use client';

import * as z from 'zod';
import { FormInput } from '@/components/forms/form-input';
import BoxDesign from '@/components/layout/box-design';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { registerSchema } from '@/lib/zod-schema/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export const ForgotPasswordView = () => {
  const router = useRouter();
  const forgetPasswordSchema = registerSchema.pick({
    email: true
  });
  type ForgetFormData = z.infer<typeof forgetPasswordSchema>;
  const form = useForm<ForgetFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: ''
    }
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: ForgetFormData) => {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: '/auth/reset-password'
    });
    if (error) {
      toast.error(error.message || 'Failed to send reset link');
      return;
    }

    toast.success('Password reset link sent to your email');
    router.push(`/auth/check-email/reset?email=${data.email}`);
  };
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
            <div className='flex w-full flex-col gap-3'>
              <Form
                form={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormInput
                  control={form.control}
                  name='email'
                  type='email'
                  label='Email'
                  placeholder='Enter your email'
                  required
                  className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                  labelClassName='text-lg'
                />

                <div className='pt-4'>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white'
                  >
                    {isLoading && <Spinner />}
                    Send reset link
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </BoxDesign>
  );
};
