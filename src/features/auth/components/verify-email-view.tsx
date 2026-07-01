'use client';

import BoxDesign from '@/components/layout/box-design';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useUserSession } from '@/hooks/use-client-session';
import { authClient } from '@/lib/auth/auth-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const { user } = useUserSession();
  const router = useRouter();
  const email = searchParams.get('email');

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Auto submit when OTP length = 6
   */
  useEffect(() => {
    if (value.length === 6 && !loading) {
      handleSubmit();
    }
  }, [value]);

  const handleSubmit = async () => {
    if (!email || loading) return;

    setLoading(true);

    await authClient.twoFactor.verifyOtp(
      {
        code: value,
        trustDevice: true
      },
      {
        async onSuccess() {
          // reset OTP
          setValue('');
          setLoading(false);

          toast.success('Email verified successfully');
          // Redirect after success
          router.push('/overview');
        },
        async onError(errorCtx) {
          // reset OTP
          setValue('');
          setLoading(false);

          if (errorCtx.error?.code === 'EMAIL_NOT_VERIFIED') {
            router.push(`/auth/verify-email?email=${user?.email}`);
          } else {
            toast.error(errorCtx.error.message || 'Invalid verification code');
          }
        }
      }
    );
  };

  return (
    <BoxDesign boxSize={85}>
      <div className='w-full'>
        <div className='h-25 w-full'></div>

        <div className='relative flex w-full flex-col items-center justify-center px-4'>
          <div className='w-full max-w-sm'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-xl font-semibold'>
                Verify your email address
              </h3>
              <p className='text-base font-medium text-neutral-500'>
                Enter the six digit verification code sent to{' '}
                <strong className='font-semibold text-neutral-600 dark:text-neutral-400'>
                  {email}
                </strong>
              </p>
            </div>

            <div className='mt-12 flex flex-col items-center gap-3'>
              <InputOTP
                maxLength={6}
                value={value}
                onChange={setValue}
                disabled={loading}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPGroup key={i}>
                    <InputOTPSlot
                      index={i}
                      className='size-11 text-xl md:size-15 md:text-2xl'
                    />
                  </InputOTPGroup>
                ))}
              </InputOTP>

              <Button
                disabled={value.length !== 6 || loading}
                className='mt-8 h-14 w-full'
              >
                {loading && <Spinner />}
                Continue
              </Button>

              <p className='mt-6 flex flex-row items-center gap-1 text-center text-sm font-medium text-neutral-500'>
                Didn't receive a code?{' '}
                <Button
                  type='button'
                  variant='link'
                  className='m-0 cursor-pointer p-0 hover:text-neutral-400'
                  // onClick={() => resendClientOtp(email!, 'email-verification')}
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
