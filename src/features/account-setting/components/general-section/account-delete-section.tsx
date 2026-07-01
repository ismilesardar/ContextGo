'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDeleteAccountModal } from '@/components/ui/modal/delete-account-modal';
import { APP_NAME } from '@/config/url.config';

export const AccountDeleteSection = () => {
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal();

  return (
    <>
      <DeleteAccountModal />
      <Card className='rounded-xl border border-red-200 p-0'>
        <div className='relative flex flex-col space-y-6 p-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>Delete Account</h2>
            <p className='text-sm text-neutral-500'>
              Permanently delete your {APP_NAME} account, all of your
              workspaces, links and their respective stats. This action cannot
              be undone - please proceed with caution.
            </p>
          </div>
        </div>
        <div className='flex items-center justify-end space-x-4 overflow-hidden rounded-b-lg border-t border-red-200 bg-red-50 px-6 py-3 dark:bg-red-700/10'>
          {/* <p className='text-sm text-neutral-500'>Email not changeable!</p> */}
          <div className='w-fit shrink-0'>
            <Button
              className='bg-red-500 hover:bg-red-400'
              variant='brand'
              size='lg'
              onClick={() => setShowDeleteAccountModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};
