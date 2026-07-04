'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
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
  promptTemplateDetailsSchema,
  type PromptTemplateDetailsFormValues
} from '@/lib/zod-schema/prompt-template-schema';
import {
  useUpdatePromptTemplate,
  type PromptTemplate
} from '../utils/use-prompt-templates';

function PromptTemplateDetailsModalHelper({
  promptTemplate,
  projectId,
  showModal,
  setShowModal
}: {
  promptTemplate: PromptTemplate;
  projectId: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const updatePromptTemplate = useUpdatePromptTemplate(
    projectId,
    promptTemplate.id
  );

  const form = useForm<PromptTemplateDetailsFormValues>({
    resolver: zodResolver(promptTemplateDetailsSchema),
    defaultValues: {
      title: promptTemplate.title,
      description: promptTemplate.description ?? ''
    }
  });

  useEffect(() => {
    if (showModal) {
      form.reset({
        title: promptTemplate.title,
        description: promptTemplate.description ?? ''
      });
    }
  }, [showModal, promptTemplate, form]);

  async function onSubmit(values: PromptTemplateDetailsFormValues) {
    await updatePromptTemplate.mutateAsync(values, {
      onSuccess: () => setShowModal(false)
    });
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-lg'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Edit details</h3>
        <p className='text-sm text-neutral-500'>
          Update this promptTemplate's title and description. Content is edited
          separately.
        </p>
      </div>

      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-4 py-4 sm:px-6'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Frontend Architecture' {...field} />
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
                  placeholder='A short summary of what this prompt template is for'
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={updatePromptTemplate.isPending}>
            {updatePromptTemplate.isPending && <Spinner className='mr-2' />}
            Save changes
          </Button>
        </div>
      </Form>
    </CustomModal>
  );
}

export function usePromptTemplateDetailsModal({
  promptTemplate,
  projectId
}: {
  promptTemplate: PromptTemplate;
  projectId: string;
}) {
  const [showPromptTemplateDetailsModal, setShowPromptTemplateDetailsModal] =
    useState(false);

  const PromptTemplateDetailsModal = useCallback(() => {
    return (
      <PromptTemplateDetailsModalHelper
        promptTemplate={promptTemplate}
        projectId={projectId}
        showModal={showPromptTemplateDetailsModal}
        setShowModal={setShowPromptTemplateDetailsModal}
      />
    );
  }, [promptTemplate, projectId, showPromptTemplateDetailsModal]);

  return useMemo(
    () => ({ setShowPromptTemplateDetailsModal, PromptTemplateDetailsModal }),
    [setShowPromptTemplateDetailsModal, PromptTemplateDetailsModal]
  );
}
