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
import { Button } from '../button';
import { Spinner } from '../spinner';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';
import { Form } from '../form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import z from 'zod';

const passkeySchema = z.object({
  name: z.string().min(3)
});

type PasskeyForm = z.infer<typeof passkeySchema>;

function CreatePasskeyModal({
  showCreatePasskeyModal,
  setShowCreatePasskeyModal
}: {
  showCreatePasskeyModal: boolean;
  setShowCreatePasskeyModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const passkeyForm = useForm<PasskeyForm>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: ''
    }
  });

  const { isSubmitting, isValid } = passkeyForm.formState;

  const handelAddPasskey = async (data: PasskeyForm) => {
    await authClient.passkey.addPasskey(data, {
      onError: (error) => {
        toast.error(
          error.error?.message ||
            'Failed to add passkey. Please try again later.'
        );
        setShowCreatePasskeyModal(false);
      },
      onSuccess: () => {
        toast.success('Passkey added successfully!');
        router.refresh();
        setShowCreatePasskeyModal(false);
      }
    });
  };

  return (
    <CustomModal
      showModal={showCreatePasskeyModal}
      setShowModal={setShowCreatePasskeyModal}
      className='md:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6'>
        <h3 className='text-lg font-medium'>Add New Passkey</h3>
        <p className='text-sm text-neutral-500'>
          Create a new passkey for secure, password less authentication.
        </p>
      </div>

      <Form
        form={passkeyForm}
        onSubmit={passkeyForm.handleSubmit(handelAddPasskey)}
        className='space-y-6 px-4 py-4 sm:px-6'
      >
        <FormInput
          control={passkeyForm.control}
          name='name'
          type='text'
          label='Passkey name'
          autoComplete='name'
          placeholder='Enter passkey name'
          required
          className='w-full rounded-md border border-neutral-300 py-5 text-xl placeholder-neutral-400 read-only:bg-neutral-100 read-only:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none sm:text-sm md:max-w-md dark:text-neutral-200'
          labelClassName='text-lg'
        />

        <Button
          type='submit'
          disabled={isSubmitting}
          className={cn(
            'w-full',
            isValid
              ? 'cursor-pointer bg-(--brand-color) hover:bg-(--brand-color)/80'
              : 'cursor-not-allowed'
          )}
        >
          {isSubmitting && <Spinner />}
          Add Key
        </Button>
      </Form>
    </CustomModal>
  );
}

export function useCreatePasskeyModal() {
  const [showCreatePasskeyModal, setShowCreatePasskeyModal] = useState(false);

  const CreatePasskeyModalCallback = useCallback(() => {
    return (
      <CreatePasskeyModal
        showCreatePasskeyModal={showCreatePasskeyModal}
        setShowCreatePasskeyModal={setShowCreatePasskeyModal}
      />
    );
  }, [showCreatePasskeyModal]);

  return useMemo(
    () => ({
      setShowCreatePasskeyModal,
      CreatePasskeyModalCallback: CreatePasskeyModalCallback
    }),
    [CreatePasskeyModalCallback]
  );
}
