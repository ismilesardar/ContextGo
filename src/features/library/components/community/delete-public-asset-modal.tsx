'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  useDeletePublicAsset,
  type PublicAssetSummary
} from '../../utils/use-public-assets';

function DeletePublicAssetModalHelper({
  asset,
  showModal,
  setShowModal
}: {
  asset: PublicAssetSummary;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const deleteAsset = useDeletePublicAsset();

  async function handleDelete() {
    await deleteAsset.mutateAsync(asset.id, {
      onSuccess: () => setShowModal(false)
    });
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Delete "{asset.title}"?</h3>
        <p className='text-sm text-neutral-500'>
          This will permanently remove this public asset for every user of
          Primiso. This action cannot be undone.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteAsset.isPending}
        >
          {deleteAsset.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeletePublicAssetModal() {
  const [asset, setAsset] = useState<PublicAssetSummary | null>(null);

  const openDeleteModal = useCallback((next: PublicAssetSummary) => {
    setAsset(next);
  }, []);

  const DeletePublicAssetModal = useCallback(() => {
    if (!asset) return null;
    return (
      <DeletePublicAssetModalHelper
        asset={asset}
        showModal={!!asset}
        setShowModal={() => setAsset(null)}
      />
    );
  }, [asset]);

  return useMemo(
    () => ({ openDeleteModal, DeletePublicAssetModal }),
    [openDeleteModal, DeletePublicAssetModal]
  );
}
