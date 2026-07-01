'use client';

import BoxDesign from '@/components/layout/box-design';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function CheckEmailView({ params }: { params: { type: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);

  const handleResendLink = async () => {
    if (!email || loading) return;

    setLoading(true);

    if (params.type === 'reset') {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: '/auth/reset-password'
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset link');
        setLoading(false);
      } else {
        toast.success('Password reset link sent to your email');
        setLoading(false);
        return;
      }
    }

    if (params.type === 'verify') {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/onboarding/welcome'
      });

      if (error) {
        toast.error(error.message || 'Something went wrong! try again.');
        setLoading(false);
        return;
      } else {
        toast.success('Verification link send successfully');
      }
    }
  };

  return (
    <BoxDesign boxSize={85}>
      <div className='w-full'>
        <div className='h-25 w-full'></div>

        <div className='relative flex w-full flex-col items-center justify-center px-4'>
          <div className='w-full max-w-sm'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-xl font-semibold'>Check your email</h3>
              <p className='text-base font-medium text-neutral-500'>
                A verification link sent to <br />
                <strong className='font-semibold text-neutral-600 dark:text-neutral-400'>
                  {email}
                </strong>
              </p>
            </div>

            <div className='mt-12 flex flex-col items-center gap-3'>
              <Button
                type='button'
                disabled={true}
                className='mt-8 h-14 w-full'
                variant='dash'
              >
                Check your email
              </Button>

              <p className='mt-6 flex flex-row items-center gap-1 text-center text-sm font-medium text-neutral-500'>
                Didn't receive a link?{' '}
                <Button
                  type='button'
                  variant='link'
                  className='m-0 cursor-pointer p-0 hover:text-neutral-400'
                  onClick={handleResendLink}
                >
                  Resend
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BoxDesign>
  );
}
