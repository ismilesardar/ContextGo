'use client';

import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { CustomModal } from '../custom-model';
import { useUserSession } from '@/hooks/use-client-session';
import { Button } from '../button';
import { Spinner } from '../spinner';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';
import { Form } from '../form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserAccountDeleteSchema } from '@/lib/zod-schema/user-account-delete-schema';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';
import { ROLES } from '@/utils/constants/organization-const';

function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { user, refreshSession } = useUserSession();
  const { role } = usePermissions();

  const confirmationText = 'confirm delete account';

  async function deleteAccount() {
    return new Promise((resolve, reject) => {
      authClient
        .deleteUser({ callbackURL: '/auth/register' })
        .then(async ({ data }) => {
          if (data?.success) {
            refreshSession();
            // delay to allow for the route change to complete
            await new Promise((resolve) =>
              setTimeout(() => {
                router.push('/auth/register');
                resolve(null);
              }, 200)
            );
            resolve(null);
          }
        })
        .catch((error) => {
          reject(
            error.message || 'Failed to delete account. Please try again later.'
          );
        });
    });
  }

  const deleteForm = useForm({
    resolver: zodResolver(getUserAccountDeleteSchema),
    defaultValues: {
      verification: ''
    },
    mode: 'onChange'
  });

  const { isSubmitting, isValid } = deleteForm.formState;

  // Workspace permission
  const canDelete = role === ROLES.OWNER;

  if (!canDelete) {
    return null;
  }

  return (
    <CustomModal
      showModal={showDeleteAccountModal}
      setShowModal={setShowDeleteAccountModal}
      className='md:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6'>
        <h3 className='text-lg font-medium'>Delete Account</h3>
        <p className='text-sm text-neutral-500'>
          Warning: This will permanently delete your account, all your
          workspaces, and all your short links.
        </p>
      </div>

      <Form
        form={deleteForm}
        onSubmit={deleteForm.handleSubmit(deleteAccount)}
        className='space-y-6 px-4 py-4 sm:px-6'
      >
        <div className='relative flex items-center gap-3 rounded-md border border-neutral-300 bg-white px-4 py-2 dark:border-neutral-600 dark:bg-neutral-900'>
          <UserAvatarProfile
            user={{
              imageUrl: user?.image
            }}
            className='size-7 flex-1'
          />

          <div className='flex flex-1 flex-col gap-0.5'>
            <h3 className='line-clamp-1 text-sm font-medium text-neutral-600 dark:text-neutral-400'>
              {user?.name || user?.email}
            </h3>
            <p className='text-xs font-medium text-neutral-500'>
              {user?.email}
            </p>
          </div>
        </div>
        {/* The Confirmation Phrase */}
        <div className='space-y-2'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            To verify, type{' '}
            <span className='font-semibold dark:text-neutral-200'>
              {confirmationText}
            </span>{' '}
            below
          </p>
          <FormInput
            control={deleteForm.control}
            name='verification'
            type='text'
            required
            placeholder=''
            className='w-full rounded-md border border-neutral-300 py-3 focus:ring-red-500 md:max-w-md'
          />
        </div>

        {canDelete && (
          <Button
            type='submit'
            disabled={isSubmitting || !isValid} // Button only works if typed correctly
            variant={isValid ? 'destructive' : 'outline'}
            className={cn(
              'w-full',
              isValid ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
          >
            {isSubmitting && <Spinner />}
            Delete
          </Button>
        )}
      </Form>
    </CustomModal>
  );
}

export function useDeleteAccountModal() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const DeleteAccountModalCallback = useCallback(() => {
    return (
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
      />
    );
  }, [showDeleteAccountModal]);

  return useMemo(
    () => ({
      setShowDeleteAccountModal,
      DeleteAccountModal: DeleteAccountModalCallback
    }),
    [DeleteAccountModalCallback]
  );
}
