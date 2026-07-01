'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import BoxDesign from '@/components/layout/box-design';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { registerSchema } from '@/lib/zod-schema/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { APP_NAME } from '@/config/url.config';
import { CardWrapper } from '@/components/share/card-wrapper';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SocialAuthButtons } from './social-auth-buttons';
import { authClient } from '@/lib/auth/auth-client';
import { Spinner } from '@/components/ui/spinner';
import { PasskeyAuthButtons } from './passkey-auth-buttons';
import { useState } from 'react';

type RegisterFormData = z.infer<typeof registerSchema>;

export const LoginView = () => {
  const router = useRouter();
  const lastMethod = authClient.getLastUsedLoginMethod();
  const [isCredential, setIsCredential] = useState<boolean>(false);

  const isSocialLast = lastMethod === 'google' || lastMethod === 'github';

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: RegisterFormData) => {
    const { error } = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password
      },
      {
        async onSuccess(context) {
          if (context.data.twoFactorRedirect) {
            const { error } = await authClient.twoFactor.sendOtp({});
            if (error) {
              toast.error(error.message || 'Failed to send verification code');
              return;
            }
            // Redirect user to OTP page
            router.push(`/auth/verify-email?email=${data.email}`);
          } else {
            router.refresh();
          }
        }
      }
    );

    if (error) {
      toast.error(error.message || 'Failed to log in');
      return;
    }
  };

  return (
    <BoxDesign>
      <div className='flex w-full flex-col items-center justify-center'>
        <div className='h-10 w-full'></div>

        <CardWrapper headerLabel={`Log in to your ${APP_NAME} account`}>
          {!lastMethod ? (
            <>
              {isCredential ? (
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
                    autoComplete='email webauthn'
                    required
                    className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                    labelClassName='text-lg'
                  />

                  <div className='relative'>
                    <FormInput
                      control={form.control}
                      name='password'
                      type='password'
                      label='Password'
                      placeholder='Enter your password'
                      autoComplete='current-password webauthn'
                      forgotPasswordLink
                      required
                      className='w-full max-w-md rounded-md border border-neutral-300 py-5 pr-3 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                      labelClassName='text-lg'
                    />
                  </div>

                  {/* Submit Button */}
                  <div className='pt-4'>
                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white'
                    >
                      {isLoading && <Spinner />}
                      Log in with email
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className='pt-4'>
                  <Button
                    onClick={() => setIsCredential(!isCredential)}
                    type='button'
                    className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white hover:bg-(--brand-color)/80'
                  >
                    Log in with email
                  </Button>
                </div>
              )}

              <div className='my-7 flex shrink items-center justify-center gap-2'>
                <div className='grow basis-0 border-b border-neutral-200'></div>
                <span className='text-content-muted text-xs leading-none font-medium uppercase'>
                  or
                </span>
                <div className='grow basis-0 border-b border-neutral-200'></div>
              </div>

              {/* social login buttons */}
              <SocialAuthButtons />

              {/* passkey auth button */}
              <div className='mt-4'>
                <PasskeyAuthButtons />
              </div>
            </>
          ) : (
            <>
              {(lastMethod === 'email' || isCredential) && (
                <>
                  {isCredential ? (
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
                        autoComplete='email webauthn'
                        required
                        className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                        labelClassName='text-lg'
                      />

                      <div className='relative'>
                        <FormInput
                          control={form.control}
                          name='password'
                          type='password'
                          label='Password'
                          placeholder='Enter your password'
                          autoComplete='current-password webauthn'
                          forgotPasswordLink
                          required
                          className='w-full max-w-md rounded-md border border-neutral-300 py-5 pr-3 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                          labelClassName='text-lg'
                        />
                      </div>

                      {/* Submit Button */}
                      <div className='pt-4'>
                        <Button
                          type='submit'
                          disabled={isLoading}
                          className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white'
                        >
                          {isLoading && <Spinner />}
                          Log in with email
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className='pt-4'>
                      <Button
                        onClick={() => setIsCredential(!isCredential)}
                        type='button'
                        className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white hover:bg-(--brand-color)/80'
                      >
                        Log in with email
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* social login buttons */}
              {isSocialLast && !isCredential && (
                <SocialAuthButtons
                  lastMethod={lastMethod}
                  isSame={true}
                  isAllButton={false}
                />
              )}
              {/* passkey auth button */}
              {lastMethod === 'passkey' && !isCredential && (
                <div className='mt-4'>
                  <PasskeyAuthButtons />
                </div>
              )}

              <div className='mt-3 text-center text-xs'>
                <span className='text-neutral-500 dark:text-neutral-400'>
                  You signed in with {lastMethod} last time
                </span>
              </div>

              <div className='my-7 flex shrink items-center justify-center gap-2'>
                <div className='grow basis-0 border-b border-neutral-200'></div>
                <span className='text-content-muted text-xs leading-none font-medium uppercase'>
                  or
                </span>
                <div className='grow basis-0 border-b border-neutral-200'></div>
              </div>

              {lastMethod !== 'email' && !isCredential && (
                <div className='pt-4'>
                  <Button
                    onClick={() => setIsCredential(!isCredential)}
                    type='button'
                    className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white hover:bg-(--brand-color)/80'
                  >
                    Log in with email
                  </Button>
                </div>
              )}

              {/* social login buttons */}
              <SocialAuthButtons
                lastMethod={lastMethod}
                isSame={false}
                isAllButton={!isCredential ? false : true}
              />

              {/* passkey auth button */}
              {(lastMethod !== 'passkey' || isCredential) && (
                <div className='mt-2'>
                  <PasskeyAuthButtons />
                </div>
              )}
            </>
          )}

          <p className='mt-6 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400'>
            Don't have an account?&nbsp;
            <Link
              className='font-semibold text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-500'
              href='/auth/register'
            >
              Sign up
            </Link>
          </p>
        </CardWrapper>
      </div>
    </BoxDesign>
  );
};
