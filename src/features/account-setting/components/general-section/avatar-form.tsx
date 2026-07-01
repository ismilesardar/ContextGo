'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { profileSchema } from '../../utils/profile-schema';
import z from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { User } from 'better-auth/types';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import Image from 'next/image';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { USER_AVATAR } from '../../utils/user-avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BASE_URL } from '@/config/url.config';

export const AvatarForm = ({
  user,
  refreshSession
}: {
  user: User;
  refreshSession: () => void;
}) => {
  const [avatarDialog, setAvatarDialog] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const avatarFormSchema = profileSchema.pick({
    image: true
  });

  type NameFormData = z.infer<typeof avatarFormSchema>;

  const avatarForm = useForm<NameFormData>({
    resolver: zodResolver(avatarFormSchema),
    defaultValues: {
      image: user?.image || undefined
    }
  });

  // Destructure isDirty from formState
  const { isDirty, isSubmitting } = avatarForm.formState;

  // Optional: Sync form if user data arrives late
  useEffect(() => {
    if (user?.image) {
      avatarForm.reset({ image: user.image });
    }
  }, [user?.image, avatarForm]);

  const onSubmit = async (newImage: NameFormData) => {
    const { error } = await authClient.updateUser(newImage);

    if (error) {
      toast.error(error?.message || 'Something went wrong! try again letter.');
      return;
    }

    // Sync the form state with the new data
    avatarForm.reset(newImage);
    refreshSession();
    toast.success('Successfully update your avatar!');
  };

  const handelChangeAvatar = (a: { name: string; image: string }) => {
    const fullPath = `${BASE_URL}${a.image}`;
    setAvatar(a.image);

    // Use setValue instead of reset
    avatarForm.setValue('image', fullPath, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const handelResetAvatar = () => {
    setAvatar(null);
    // Reset specifically to the original user image
    avatarForm.setValue('image', user?.image || '', {
      shouldDirty: true
    });
  };

  return (
    <>
      {
        <Dialog open={avatarDialog} onOpenChange={(o) => setAvatarDialog(o)}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Choose your avatar</DialogTitle>
            </DialogHeader>
            <ScrollArea className='h-[400px] w-full rounded-md border p-4'>
              <div className='flex flex-row flex-wrap justify-center gap-2'>
                {USER_AVATAR.map((a) => (
                  <Button
                    onClick={() => handelChangeAvatar(a)}
                    key={a.name}
                    className={`size-19 cursor-pointer overflow-hidden rounded-lg p-0 hover:opacity-85 ${avatar === a.image ? 'border-2 border-amber-200' : ''}`}
                  >
                    <Image
                      src={a.image}
                      alt={a.name}
                      width={100}
                      height={100}
                      className='size-full object-cover'
                    />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      }
      <Card className='p-0'>
        <Form
          form={avatarForm}
          onSubmit={avatarForm.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:justify-between'>
            <div className='flex flex-col space-y-1'>
              <h2 className='text-base font-semibold'>Your Avatar</h2>
              <p className='text-sm text-neutral-500'>
                This is your avatar image on your Dub account.
              </p>
              <p className='text-sm text-neutral-500'>
                Click your avatar to upload a new image.
              </p>
            </div>
            <div className='mt-1'>
              <label className='group relative isolate flex aspect-1200/630 h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-white transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-500 dark:hover:bg-neutral-500'>
                <div className='absolute inset-0 z-5'></div>
                {/* <div > */}
                {avatar ? (
                  <Button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handelResetAvatar();
                    }}
                    className='absolute inset-0 z-3 flex size-full flex-col items-center justify-center rounded-[inherit] border-2 border-transparent bg-white opacity-0 transition-all group-hover:opacity-100 dark:bg-neutral-700'
                  >
                    <Icons.restore />
                    <span className='sr-only'>File reset</span>
                  </Button>
                ) : (
                  <Button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      setAvatarDialog(!avatarDialog);
                    }}
                    className='absolute inset-0 z-3 flex size-full flex-col items-center justify-center rounded-[inherit] border-2 border-transparent bg-white opacity-0 transition-all group-hover:opacity-100 dark:bg-neutral-700'
                  >
                    <Icons.photoEdit />
                    <span className='sr-only'>File upload</span>
                  </Button>
                )}
                {/* </div> */}
                <Image
                  width={100}
                  height={100}
                  unoptimized
                  alt='Preview'
                  className='h-full w-full rounded-[inherit] object-cover'
                  src={
                    avatar ? avatar : user.image || '/assets/avatars/man-1.jpeg'
                  }
                />
                <div className='sr-only mt-1 flex shadow-sm'>
                  {/* <FormFileUpload  /> */}
                </div>
              </label>
            </div>
          </div>

          <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
            <p className='text-sm text-neutral-500'>Choose you Avatar.</p>
            <div className='w-fit shrink-0'>
              <Button
                type='submit'
                disabled={!isDirty || isSubmitting}
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
    </>
  );
};
