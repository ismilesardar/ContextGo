'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import BoxDesign from '@/components/layout/box-design';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { registerSchema } from '@/lib/zod-schema/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_NAME } from '@/config/url.config';
import { CardWrapper } from '@/components/share/card-wrapper';

import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { redirect, useRouter } from 'next/navigation';
import { SocialAuthButtons } from './social-auth-buttons';
import { authClient } from '@/lib/auth/auth-client';

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterView() {
  const router = useRouter();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const isLoading = form.formState.isSubmitting;

  // Handle the Enter key press on the email field
  const handleEmailKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      // Prevent the form from submitting early
      e.preventDefault();

      // Manually trigger zod validation for the email field
      const isEmailValid = await form.trigger('email');

      if (isEmailValid) {
        setShowPassword(true);
      }
    }
  };

  const checkEmailValid = async () => {
    if (!showPassword) {
      const isEmailValid = await form.trigger('email');

      if (isEmailValid) {
        setShowPassword(true);
      }
      return;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    // Only allow submission if the password field is actually shown
    if (!showPassword) return;

    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.email.split('@')[0],
      callbackURL: '/onboarding/welcome'
    });

    if (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      return;
    } else {
      form.reset();
      setShowPassword(false);

      toast.success(
        'Registration successful! Please check your email to verify your account.'
      );
      redirect(
        `/auth/check-email/verify?email=${encodeURIComponent(data.email)}`
      );
    }
  };

  return (
    <BoxDesign boxSize={75}>
      <div className='flex w-full flex-col items-center justify-center'>
        <div className='h-10 w-full'></div>
        <CardWrapper headerLabel={`Create your ${APP_NAME} account`}>
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
              autoComplete='email'
              required
              onKeyDown={handleEmailKeyDown}
              className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-2xl tracking-wide placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
              labelClassName='text-lg'
            />

            {showPassword && (
              <div className='animate-in fade-in slide-in-from-top-2 relative duration-300'>
                <FormInput
                  control={form.control}
                  name='password'
                  type='password'
                  label='Password'
                  placeholder='Enter your password'
                  autoComplete='new-password'
                  required
                  className='w-full max-w-md rounded-md border border-neutral-300 py-5 pr-3 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                  labelClassName='text-lg'
                />
              </div>
            )}

            {/* Submit Button */}
            <div className='pt-4'>
              {showPassword ? (
                <Button
                  type='submit'
                  disabled={isLoading}
                  className={`w-full max-w-md cursor-pointer rounded-md py-6 text-lg font-medium text-white ${isLoading ? 'opacity-70' : 'bg-(--brand-color)'}`}
                >
                  {isLoading && <Spinner />}
                  Sign Up
                </Button>
              ) : (
                <Button
                  type='button'
                  onClick={checkEmailValid}
                  className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white'
                >
                  Continue
                </Button>
              )}
            </div>
          </Form>

          <div className='my-7 flex shrink items-center justify-center gap-2'>
            <div className='grow basis-0 border-b border-neutral-200'></div>
            <span className='text-content-muted text-xs leading-none font-medium uppercase'>
              or
            </span>
            <div className='grow basis-0 border-b border-neutral-200'></div>
          </div>

          {/* social login buttons */}
          <SocialAuthButtons />

          <p className='mt-6 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400'>
            Already have an account?&nbsp;
            <Link
              className='font-semibold text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-500'
              href='/auth/login'
            >
              Log in
            </Link>
          </p>
        </CardWrapper>
      </div>
    </BoxDesign>
  );
}
