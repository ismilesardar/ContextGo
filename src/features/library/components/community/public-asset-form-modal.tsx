'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomModal } from '@/components/ui/custom-model';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import {
  publicAssetSchema,
  type PublicAssetFormValues
} from '@/lib/zod-schema/public-asset-schema';
import { RESOURCE_TYPE_OPTIONS } from '../../utils/library-copy';
import {
  useCreatePublicAsset,
  useUpdatePublicAsset,
  usePublicAsset,
  type PublicAssetSummary
} from '../../utils/use-public-assets';

function PublicAssetFormModalHelper({
  mode,
  asset,
  showModal,
  setShowModal
}: {
  mode: 'create' | 'edit';
  asset?: PublicAssetSummary;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: detail } = usePublicAsset(
    mode === 'edit' && showModal ? asset?.id : undefined
  );

  const createAsset = useCreatePublicAsset();
  const updateAsset = useUpdatePublicAsset();

  const form = useForm<PublicAssetFormValues>({
    resolver: zodResolver(publicAssetSchema),
    values: {
      title: detail?.title ?? asset?.title ?? '',
      description: detail?.description ?? asset?.description ?? '',
      content: detail?.content ?? '',
      resourceType: detail?.resourceType ?? asset?.resourceType ?? 'context'
    }
  });

  const isLoading = createAsset.isPending || updateAsset.isPending;

  async function onSubmit(values: PublicAssetFormValues) {
    if (mode === 'create') {
      await createAsset.mutateAsync(values, {
        onSuccess: () => {
          setShowModal(false);
          form.reset();
        }
      });
    } else if (asset) {
      const { resourceType: _resourceType, ...updateValues } = values;
      await updateAsset.mutateAsync(
        { assetId: asset.id, ...updateValues },
        { onSuccess: () => setShowModal(false) }
      );
    }
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='overflow-hidden sm:max-w-2xl'
    >
      <div className='flex max-h-[85vh] flex-col overflow-hidden'>
        <div className='space-y-1 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
          <h3 className='text-lg font-medium'>
            {mode === 'create' ? 'Publish a public asset' : 'Edit public asset'}
          </h3>
          <p className='text-muted-foreground text-sm'>
            {mode === 'create'
              ? 'Visible to every user of Primiso — anyone can import it into their own project.'
              : 'Changes are visible to everyone immediately.'}
          </p>
        </div>

        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Code Review Checklist' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='A short summary of what this asset covers'
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='resourceType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mode === 'edit'}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a resource type' />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Document the knowledge this asset should capture…'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Spinner className='mr-2' />}
              {mode === 'create' ? 'Publish' : 'Save changes'}
            </Button>
          </div>
        </Form>
      </div>
    </CustomModal>
  );
}

export function usePublicAssetFormModal() {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [asset, setAsset] = useState<PublicAssetSummary | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const openCreateModal = useCallback(() => {
    setMode('create');
    setAsset(undefined);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((next: PublicAssetSummary) => {
    setMode('edit');
    setAsset(next);
    setShowModal(true);
  }, []);

  const PublicAssetFormModal = useCallback(() => {
    if (!showModal) return null;
    return (
      <PublicAssetFormModalHelper
        mode={mode}
        asset={asset}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    );
  }, [mode, asset, showModal]);

  return useMemo(
    () => ({ openCreateModal, openEditModal, PublicAssetFormModal }),
    [openCreateModal, openEditModal, PublicAssetFormModal]
  );
}
