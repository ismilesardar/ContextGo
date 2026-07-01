'use client';

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCreatePasskeyModal } from '@/components/ui/modal/create-passkey-modal';
import { APP_NAME } from '@/config/url.config';
import { authClient } from '@/lib/auth/auth-client';
import { Passkey } from '@better-auth/passkey';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function PasskeyViewSection({ passkeys }: { passkeys: Passkey[] }) {
  const router = useRouter();
  const { setShowCreatePasskeyModal, CreatePasskeyModalCallback } =
    useCreatePasskeyModal();

  const handelDeletePasskey = async (passkeyId: string) => {
    return authClient.passkey.deletePasskey(
      { id: passkeyId },
      {
        onError: (error) => {
          toast.error(
            error.error?.message ||
              'Failed to delete passkey. Please try again later.'
          );
        },
        onSuccess: () => {
          toast.success('Passkey deleted successfully!');
          router.refresh();
        }
      }
    );
  };

  return (
    <>
      <CreatePasskeyModalCallback />
      <Card className='p-0'>
        <div className='relative flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Passkeys</h2>
            <p className='text-sm text-neutral-500'>
              Set up your passkey and enhance your {APP_NAME} account security.
            </p>
          </div>
          <div className='flex min-h-6 items-center justify-center rounded border border-dashed p-4'>
            {passkeys.length > 0 ? (
              <div className='flex size-full flex-col space-y-4'>
                {passkeys.map((passkey) => (
                  <div
                    key={passkey.id}
                    className='flex w-full items-center justify-between rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800'
                  >
                    <div className='flex flex-col gap-1'>
                      <p className='text-sm font-medium'>{passkey.name}</p>
                      <p className='text-xs text-neutral-500'>
                        Added on{' '}
                        {new Date(passkey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <BetterAuthActionButton
                      requireAreYouSure
                      areYouSureDescription={`This action will permanently delete the passkey named "${passkey.name}"`}
                      variant='destructive'
                      className='cursor-pointer'
                      size='icon'
                      action={() => handelDeletePasskey(passkey.id)}
                    >
                      <Icons.trash className='h-4 w-4' />
                    </BetterAuthActionButton>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-neutral-500'>No passkeys added yet.</p>
            )}
          </div>
        </div>

        <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='text-sm text-neutral-500'>
            Password less authentication.
          </p>
          <div className='w-fit shrink-0'>
            <Button
              variant='brand'
              onClick={() => setShowCreatePasskeyModal(true)}
            >
              New Passkey
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
