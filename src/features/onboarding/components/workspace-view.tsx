'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/forms/form-input';
import BoxDesign from '@/components/layout/box-design';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { workspaceSchema } from '@/lib/zod-schema/workspace-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import UploadFileSvg from '@/components/svg/upload-file-svg';
import { FileUploader } from '@/components/file-uploader';
import Link from 'next/link';
import QuestionRoundSvg from '@/components/svg/question-round-svg';
import { useEffect, useState } from 'react';
import { createSlug } from '@/utils/create-slug';
import { logoLight } from '@/config/image-url';
import Image from 'next/image';
import { APP_NAME, BASE_URL } from '@/config/url.config';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

type WorkspaceFormData = z.infer<typeof workspaceSchema>;

const WorkspaceView = () => {
  const { data, refetch } = authClient.useSession();
  const router = useRouter();
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      slug: '',
      logo: `${BASE_URL}/assets/avatars/workspace.png`
    }
  });

  const watchedName = form.watch('name');
  const isLoading = form.formState.isSubmitting;

  const [showUploadBtn, setShowUploadBtn] = useState<boolean>(false);

  useEffect(() => {
    if (!watchedName) return;

    const slug = createSlug(watchedName);

    // only auto-set slug if user hasn't manually changed it
    // const currentSlug = form.getValues('slug');
    // if (!currentSlug) {
    form.setValue('slug', slug, {
      shouldValidate: true,
      shouldDirty: true
    });
    // }
  }, [watchedName, form]);

  const handelUploadBtnShow = () => {
    setShowUploadBtn(!showUploadBtn);
  };

  const onSubmit = async (workspace: WorkspaceFormData) => {
    // 1. Check if the slug exists
    const { data, error } = await authClient.organization.checkSlug({
      slug: workspace.slug
    });

    if (error) {
      toast.error(error.message || 'Something went wrong!');
      return;
    }

    // 2. If status is false (meaning slug is taken/invalid)
    // Adjust "data.status" based on your actual API response structure
    if (!data.status) {
      form.setError('slug', {
        type: 'manual',
        message: `The slug ${workspace.slug} is already taken.`
      });
      return; // Stop the execution here
    }

    // 3. Upload logo if a file was selected
    let logoUrl = workspace.logo;
    if (logoFiles.length > 0) {
      const fd = new FormData();
      fd.append('file', logoFiles[0]);
      try {
        const res = await fetch('/api/workspaces/logo', {
          method: 'POST',
          body: fd
        });
        if (res.ok) {
          const result = await res.json();
          logoUrl = `/api/workspaces/logo?path=${encodeURIComponent(result.path)}`;
        }
      } catch {
        // fall through and use default logo
      }
    }

    // 4. If slug is available, proceed with creation
    const res = await authClient.organization.create({
      ...workspace,
      logo: logoUrl
    });

    if (res.error) {
      toast.error(res.error.message || 'Failed to create organization');
    } else {
      // Refresh the session cookie cache with the new defaultWorkspace.
      // The afterCreateOrganization hook writes the DB via prisma (bypassing
      // better-auth), so without this the cookie cache keeps the stale null
      // value and the proxy redirects to /onboarding for up to 15 min.
      await authClient.updateUser({ defaultWorkspace: workspace.slug });
      await authClient.organization.setActive({ organizationId: res.data.id });
      form.reset();
      setLogoFiles([]);
      toast.success('Workspace created successfully!');
      refetch();
      router.push(`/${res.data.slug}/overview`);
    }
  };

  return (
    <BoxDesign boxSize={85}>
      <div className='flex w-full items-center justify-center py-16'>
        <Card className='w-full border-none bg-transparent shadow-none md:w-125'>
          <CardHeader>
            <CardTitle className='text-center text-[24px] font-semibold'>
              Create your workspace
            </CardTitle>
            <CardDescription className='text-center text-[21px] text-balance text-neutral-500 dark:text-neutral-400'>
              Set up a shared space to manage your links with your team.{' '}
              <Link
                href='/help/article/what-is-a-workspace'
                target='_blank'
                className='cursor-help font-medium underline decoration-dotted underline-offset-2 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-600'
              >
                Learn more.
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent className='mt-7'>
            <Form
              form={form}
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormInput
                control={form.control}
                name='name'
                type='text'
                label='Workspace name'
                placeholder='Enter workspace name'
                required
                className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                labelClassName='text-lg'
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem className='not-first-of-type:'>
                    <FormLabel className='text-lg'>
                      Workspace slug
                      {/* {requiredIcon && <span className='ml-1 text-red-500'>*</span>} */}
                    </FormLabel>

                    <FormControl>
                      <div className='relative mt-2 flex rounded-md shadow-sm'>
                        <span className='inline-flex items-center rounded-l-md border border-r-0 border-(--brand-color) bg-(--brand-color) px-5 text-white sm:text-[17px]'>
                          app.dub.co
                        </span>
                        <Input
                          {...field}
                          type='text'
                          placeholder='Enter workspace slug'
                          className='w-full max-w-md rounded-l-none rounded-r-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                          required
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className='mt-1.5 text-[16px] text-neutral-500'>
                      You can change this later in your workspace settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label>
                  <p className='block text-sm font-medium text-neutral-700 dark:text-neutral-400'>
                    Workspace logo
                  </p>
                  <div className='mt-1.5 flex items-center gap-5'>
                    <label className='group relative isolate flex aspect-1200/630 size-20 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-neutral-300 transition-all hover:bg-neutral-50'>
                      {/* <div className='absolute inset-0 z-5'></div> */}
                      <div
                        onMouseEnter={handelUploadBtnShow}
                        onMouseLeave={handelUploadBtnShow}
                        className='absolute inset-0 z-3 flex flex-col items-center justify-center rounded-[inherit] border-2 border-transparent bg-(--brand-color)/90 transition-all group-hover:bg-(--brand-color)'
                      >
                        <div className='flex size-11 items-center justify-center rounded-full shadow'>
                          {/* {showUploadBtn ? (
                            <UploadFileSvg className='animate-in fade-in size-5' />
                          ) : ( */}
                          <Image
                            unoptimized
                            src={
                              logoFiles[0]
                                ? URL.createObjectURL(logoFiles[0])
                                : '/assets/avatars/workspace.png'
                            }
                            alt={`${APP_NAME} a software company`}
                            width={100}
                            height={100}
                            className='animate-in fade-in size-full rounded-full object-cover'
                          />
                          {/* )} */}
                        </div>
                        <span className='sr-only'>File upload</span>
                      </div>
                      <div className='sr-only mt-1 flex shadow-sm'>
                        <FileUploader
                          value={[]}
                          onValueChange={(files) =>
                            setLogoFiles(
                              Array.isArray(files) ? files.slice(-1) : []
                            )
                          }
                          maxSize={5000000}
                          maxFiles={1}
                          accept={{
                            'image/jpeg': [],
                            'image/png': [],
                            'image/webp': []
                          }}
                        />
                      </div>
                    </label>
                    <div>
                      <div className='hover:bg-bg-muted flex h-7 w-fit cursor-pointer items-center rounded-md border border-(--brand-color) bg-(--brand-color)/90 px-2 text-xs tracking-wide transition-all outline-none'>
                        Upload image
                      </div>
                      <p className='mt-1.5 text-[15px] text-neutral-500'>
                        Recommended size: 160x160px
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <Button
                type='submit'
                className='group text-content-inverted flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-black bg-(--brand-color) px-4 text-[16px] whitespace-nowrap transition-all hover:bg-(--brand-color) dark:border-(--brand-color)'
              >
                {isLoading && <Spinner />}
                <div className='min-w-0 truncate'>Create workspace</div>
              </Button>
            </Form>
          </CardContent>
        </Card>

        <div className='fixed bottom-0 left-0 z-40 m-5 flex flex-col gap-2'>
          <div className='flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400'>
            You're signed in as{' '}
            <b className='text-neutral-800 dark:text-neutral-500'>
              {data?.user?.email}
            </b>
          </div>
          <Button
            type='button'
            className='group border-border-subtle text-content-emphasis hover:bg-bg-muted flex h-8 w-fit items-center justify-center gap-2 rounded-lg border bg-(--brand-color)/30 px-3 text-xs whitespace-nowrap shadow-sm transition-all'
          >
            <div className='min-w-0 truncate'>Sign in as a different user</div>
          </Button>
        </div>

        <div className='fixed right-0 bottom-0 z-40 m-5'>
          <div className='flex items-center gap-3'>
            <div className='shrink-0'>
              <Link
                href='/contact/support'
                target='_blank'
                className='text-content-default flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-(--brand-color)/20'
              >
                <QuestionRoundSvg />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BoxDesign>
  );
};

export default WorkspaceView;
