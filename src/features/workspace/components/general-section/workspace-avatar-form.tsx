'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import Image from 'next/image';
import { Icons } from '@/components/icons';
import { FileUploader } from '@/components/file-uploader';
import { activeWorkspaceSchema } from '../../utils/workspace-schema';
import { useWorkspaceStore } from '@/store';
import { APP_NAME } from '@/config/url.config';

export const WorkspaceAvatarForm = () => {
  const { activeWorkspace, addActiveWorkspace } = useWorkspaceStore(
    (state) => state
  );

  const [logoFiles, setLogoFiles] = useState<File[]>([]);

  // Helper: extract B2 key from a proxy URL or raw key
  const toB2Key = (url: string): string | null => {
    if (!url) return null;
    if (url.startsWith('logos/')) return url;
    const match = url.match(/[?&]path=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const avatarFormSchema = activeWorkspaceSchema.pick({
    logo: true
  });

  type WorkspaceFormData = z.infer<typeof avatarFormSchema>;

  const workspaceAvatarForm = useForm<WorkspaceFormData>({
    resolver: zodResolver(avatarFormSchema),
    defaultValues: {
      logo: ''
    }
  });

  // Destructure isDirty from formState
  const { isDirty, isSubmitting } = workspaceAvatarForm.formState;
  const hasFile = logoFiles.length > 0;

  // Optional: Sync form if user data arrives late
  useEffect(() => {
    if (activeWorkspace?.logo) {
      workspaceAvatarForm.reset({ logo: activeWorkspace.logo });
    }
  }, [activeWorkspace?.logo, workspaceAvatarForm]);

  const onSubmit = async (newImage: WorkspaceFormData) => {
    if (!activeWorkspace) return;

    // Upload new logo if a file was selected
    let newLogoUrl = newImage.logo || '';
    if (logoFiles.length > 0) {
      const fd = new FormData();
      fd.append('file', logoFiles[0]);

      try {
        const res = await fetch('/api/workspaces/logo', {
          method: 'POST',
          body: fd
        });
        if (res.ok) {
          const data = await res.json();
          newLogoUrl = `/api/workspaces/logo?path=${encodeURIComponent(data.path)}`;

          // Delete old logo from B2 if it exists
          const oldKey = toB2Key(activeWorkspace.logo || '');
          if (oldKey) {
            fetch('/api/workspaces/logo', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: oldKey })
            }).catch(() => {});
          }
        }
      } catch {
        toast.error('Logo upload failed');
        return;
      }
    }

    const { error } = await authClient.organization.update({
      data: { logo: newLogoUrl },
      organizationId: activeWorkspace.id
    });

    if (error) {
      toast.error(error?.message || 'Something went wrong! try again later.');
      return;
    }

    // Sync the form state with the new data
    workspaceAvatarForm.reset({ logo: newLogoUrl });
    setLogoFiles([]);

    // Refresh the store so all UI components update in real-time
    try {
      const { refreshActiveWorkspace } = useWorkspaceStore.getState();
      await refreshActiveWorkspace({
        slug: activeWorkspace.slug,
        id: activeWorkspace.id
      });
    } catch {
      // Silently fail — org was already updated in DB
    }

    // Also update the logo in the workspaces list (sidebar dropdown, etc.)
    useWorkspaceStore.setState((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === activeWorkspace.id ? { ...w, logo: newLogoUrl } : w
      )
    }));

    toast.success('Logo updated successfully!');
  };

  return (
    <Card className='p-0'>
      <Form
        form={workspaceAvatarForm}
        onSubmit={workspaceAvatarForm.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:justify-between'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Workspace Avatar</h2>
            <p className='text-sm text-neutral-500'>
              This is your workspace's logo on {APP_NAME}.
            </p>
            <p className='text-sm text-neutral-500'>
              Click the logo to upload a new image.
            </p>
          </div>
          <div className='mt-1'>
            <label className='group relative isolate flex aspect-1200/630 h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-white transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-500 dark:hover:bg-neutral-500'>
              <div className='absolute inset-0 z-5'></div>
              <div className='absolute inset-0 z-3 flex flex-col items-center justify-center rounded-[inherit] border-2 border-transparent bg-white opacity-0 transition-all group-hover:opacity-100 dark:bg-neutral-700'>
                <Icons.photoEdit />
                <span className='sr-only'>File upload</span>
              </div>
              <Image
                width={100}
                height={100}
                unoptimized
                alt='Preview'
                className='h-full w-full rounded-[inherit] object-cover'
                src={
                  logoFiles.length
                    ? URL.createObjectURL(logoFiles[0])
                    : activeWorkspace?.logo || '/assets/avatars/workspace.png'
                }
              />
              <div className='sr-only mt-1 flex shadow-sm'>
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
          </div>
        </div>

        <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='text-sm text-neutral-500'>
            Square image recommended. Accepted file types: .png, .jpg. Max file
            size: 2MB.
          </p>
          <div className='w-fit shrink-0'>
            <Button
              type='submit'
              disabled={(!isDirty && !hasFile) || isSubmitting}
              variant='brand'
              size='lg'
            >
              {isSubmitting && <Spinner />}
              Save Changes
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};
