'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../form';
import { FormInput } from '@/components/forms/form-input';
import { APP_NAME, BASE_URL } from '@/config/url.config';
import { Input } from '../input';
import Image from 'next/image';
import { Button } from '../button';
import { Spinner } from '../spinner';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workspaceSchema } from '@/lib/zod-schema/workspace-schema';
import { createSlug } from '@/utils/create-slug';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { cn } from '@/lib/utils';
import z from 'zod';
import { FileUploader } from '@/components/file-uploader';

type FormData = {
  name: string;
  slug: string;
  logo?: string;
};

type CreateWorkspaceForm = z.infer<typeof workspaceSchema>;

export function CreateWorkspaceForm({
  onSuccess,
  className
}: {
  onSuccess?: (data: FormData) => void;
  className?: string;
}) {
  const [showUploadBtn, setShowUploadBtn] = useState<boolean>(false);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);

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
    form.setValue('slug', slug, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [watchedName, form]);

  async function handleCreateOrganization(data: CreateWorkspaceForm) {
    let logoUrl = data.logo;

    // Upload logo file first if one was selected
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
        // Fall through to create org even if logo upload fails
      }
    }

    const res = await authClient.organization.create({
      ...data,
      logo: logoUrl
    });

    if (res.error) {
      toast.error(res.error.message || 'Failed to create organization');
    } else {
      onSuccess?.(data);
      form.reset();
      setLogoFiles([]);
      // set active workspace name
      setActiveWorkspaceName(data.slug);
    }
  }

  const handelUploadBtnShow = () => {
    setShowUploadBtn(!showUploadBtn);
  };

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(handleCreateOrganization)}
      className={cn(
        'flex flex-col space-y-6 px-4 py-2 text-left sm:px-16',
        className
      )}
    >
      <FormInput
        control={form.control}
        name='name'
        type='text'
        label='Workspace name'
        placeholder='Enter workspace name'
        required
        className='w-full rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm md:max-w-md dark:text-neutral-200'
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
                  {/* {BASE_URL} */}
                  shibsa.co
                </span>
                <Input
                  {...field}
                  type='text'
                  placeholder='Enter workspace slug'
                  className='w-full rounded-l-none rounded-r-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm md:max-w-md dark:text-neutral-200'
                  required
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription className='mt-1.5 text-sm text-neutral-500 dark:text-neutral-400'>
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
                    src={
                      logoFiles[0]
                        ? URL.createObjectURL(logoFiles[0])
                        : '/assets/avatars/workspace.png'
                    }
                    alt={`${APP_NAME} logo`}
                    width={100}
                    height={100}
                    className='animate-in fade-in size-full rounded-full object-cover'
                  />
                  {/* )} */}
                </div>
                <span className='sr-only'>File upload</span>
              </div>
              <div className='mt-1 flex shadow-sm'>
                <FileUploader
                  value={logoFiles}
                  onValueChange={(files) =>
                    setLogoFiles(Array.isArray(files) ? files.slice(-1) : files)
                  }
                  maxSize={2000000}
                  maxFiles={10}
                  accept={{
                    'image/jpeg': [],
                    'image/png': [],
                    'image/webp': [],
                    'image/gif': []
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
  );
}
