'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
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
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Link from 'next/link';
import { FormInput } from '@/components/forms/form-input';
import Image from 'next/image';
import { APP_NAME, BASE_URL } from '@/config/url.config';
import { Spinner } from '@/components/ui/spinner';
import { workspaceSchema } from '@/lib/zod-schema/workspace-schema';
import { createSlug } from '@/utils/create-slug';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { useParams, usePathname } from 'next/navigation';
import { changeWorkspaceName } from '@/utils/workspace-name-change';

type CreateWorkspaceForm = z.infer<typeof workspaceSchema>;

export function CreateWorkspaceButton({
  onOpen
}: {
  onOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const params = useParams();

  const [organizationModelOpen, setOrganizationModelOpen] =
    useState<boolean>(false);
  const [showUploadBtn, setShowUploadBtn] = useState<boolean>(false);

  const form = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      slug: '',
      logo: `${BASE_URL}/assets/avatars/workspace.png`
    }
  });

  const watchedName = form.watch('name');
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (!watchedName) return;

    const slug = createSlug(watchedName);

    // only auto-set slug if user hasn't manually changed it
    // const currentSlug = form.getValues('slug');
    form.setValue('slug', slug, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [watchedName, form]);

  async function handleCreateOrganization(data: CreateWorkspaceForm) {
    const res = await authClient.organization.create(data);

    if (res.error) {
      toast.error(res.error.message || 'Failed to create organization');
    } else {
      form.reset();
      setOrganizationModelOpen(false);
      onOpen(false);

      // set active workspace name
      setActiveWorkspaceName(data.slug);

      if (!params?.workspace) return;

      const newPath = changeWorkspaceName({
        pathName: pathname,
        oldName: Array.isArray(params.workspace)
          ? params.workspace[0]
          : params.workspace,
        newName: data.slug
      });

      window.location.href = newPath;
    }
  }

  const handelUploadBtnShow = () => {
    setShowUploadBtn(!showUploadBtn);
  };

  return (
    <Dialog
      open={organizationModelOpen}
      onOpenChange={(c) => {
        setOrganizationModelOpen(c);
        onOpen(c);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant='secondary'
          className='my-1 flex w-full cursor-pointer items-center justify-start gap-x-2.5 rounded-md p-2 text-neutral-700 transition-all duration-75 hover:bg-neutral-200/10 dark:text-neutral-300'
        >
          <Icons.add />
          <span className='block truncate'>Create workspace</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='p-0'>
        <Card className='w-full border-none bg-transparent shadow-none'>
          <CardHeader className='flex flex-col items-center justify-center space-y-1 border-b border-neutral-200 px-4 py-2 sm:px-16 dark:border-neutral-600'>
            <div className='flex size-11 items-center justify-center rounded-full shadow'>
              <Image
                unoptimized
                src='/assets/logos/shibsa-single.png'
                alt={`${APP_NAME} a software company`}
                width={100}
                height={100}
                className='animate-in fade-in size-full rounded-full object-cover'
              />
            </div>
            <CardTitle className='text-center text-[18px] font-semibold'>
              Create your workspace
            </CardTitle>
            <CardDescription className='text-center text-[14px] text-balance text-neutral-500 dark:text-neutral-400'>
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

          <CardContent className='p-0'>
            <Form
              form={form}
              onSubmit={form.handleSubmit(handleCreateOrganization)}
              className='flex flex-col space-y-6 px-4 py-2 text-left sm:px-16'
            >
              <FormInput
                control={form.control}
                name='name'
                type='text'
                label='Workspace name'
                placeholder='Enter workspace name'
                required
                className='w-full max-w-md rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm dark:text-neutral-200'
                labelClassName='text-sm'
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem className='not-first-of-type:'>
                    <FormLabel className='text-sm'>Workspace slug</FormLabel>

                    <FormControl>
                      <div className='relative mt-2 flex rounded-md shadow-sm'>
                        <span className='inline-flex items-center rounded-l-md border border-r-0 border-(--brand-color) bg-(--brand-color) px-5 text-white sm:text-[17px]'>
                          {BASE_URL}
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
                    <FormDescription className='mt-1.5 text-sm text-neutral-500'>
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
                    <label className='group relative isolate flex aspect-1200/630 size-15 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-neutral-300 transition-all hover:bg-neutral-50'>
                      {/* <div className='absolute inset-0 z-5'></div> */}
                      <div
                        onMouseEnter={handelUploadBtnShow}
                        onMouseLeave={handelUploadBtnShow}
                        className='absolute inset-0 z-3 flex flex-col items-center justify-center rounded-[inherit] border-2 border-transparent bg-(--brand-color)/90 transition-all group-hover:bg-(--brand-color)'
                      >
                        <div className='flex size-9 items-center justify-center rounded-full shadow'>
                          {/* {showUploadBtn ? (
                                    <UploadFileSvg className='animate-in fade-in size-5' />
                                  ) : ( */}
                          <Image
                            unoptimized
                            src='/assets/avatars/workspace.png'
                            alt={`${APP_NAME} a software company`}
                            width={100}
                            height={100}
                            className='animate-in fade-in size-full rounded-full object-cover'
                          />
                          {/* )} */}
                        </div>
                        <span className='sr-only'>File upload</span>
                      </div>
                      {/* <div className='sr-only mt-1 flex shadow-sm'>
                                <FormFileUpload
                                  control={form.control}
                                  name='logo'
                                  config={fileUploadConfig}
                                />
                              </div> */}
                    </label>
                    {/* <div>
                              <div className='hover:bg-bg-muted flex h-7 w-fit cursor-pointer items-center rounded-md border border-(--brand-color) bg-(--brand-color)/90 px-2 text-xs tracking-wide transition-all outline-none'>
                                Upload image
                              </div>
                              <p className='mt-1.5 text-[15px] text-neutral-500'>
                                Recommended size: 160x160px
                              </p>
                            </div> */}
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
      </DialogContent>
    </Dialog>
  );
}
