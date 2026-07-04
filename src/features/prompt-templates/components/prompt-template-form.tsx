'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
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
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import {
  promptTemplateSchema,
  type PromptTemplateFormValues
} from '@/lib/zod-schema/prompt-template-schema';
import {
  useCreatePromptTemplate,
  useUpdatePromptTemplate,
  type PromptTemplate
} from '../utils/use-prompt-templates';

/**
 * Shared create/edit form for a resource type. Create shows title +
 * description + RichTextEditor content in one form (a title is required to
 * create the row at all); edit shows content only — title/description are
 * edited separately via PromptTemplateDetailsModal.
 */
export function PromptTemplateForm({
  mode,
  promptTemplate,
  workspaceSlug,
  projectId
}: {
  mode: 'create' | 'edit';
  promptTemplate?: PromptTemplate;
  workspaceSlug: string;
  projectId: string;
}) {
  const router = useRouter();
  const createPromptTemplate = useCreatePromptTemplate(projectId);
  const updatePromptTemplate = useUpdatePromptTemplate(
    projectId,
    promptTemplate?.id ?? ''
  );

  const form = useForm<PromptTemplateFormValues>({
    resolver: zodResolver(promptTemplateSchema),
    defaultValues: {
      title: promptTemplate?.title ?? '',
      description: promptTemplate?.description ?? '',
      content: promptTemplate?.content ?? ''
    }
  });

  const isLoading =
    createPromptTemplate.isPending || updatePromptTemplate.isPending;

  async function onSubmit(values: PromptTemplateFormValues) {
    if (mode === 'create') {
      await createPromptTemplate.mutateAsync(values, {
        onSuccess: (created) => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/prompt-templates/${created.id}`
          );
        }
      });
    } else if (promptTemplate) {
      await updatePromptTemplate.mutateAsync(values, {
        onSuccess: () => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/prompt-templates/${promptTemplate.id}`
          );
        }
      });
    }
  }

  return (
    <Card className='rounded-lg p-6'>
      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        {mode === 'create' && (
          <>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Bug Report Summary' {...field} />
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
          </>
        )}

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
                  placeholder='Write the reusable prompt text — use {{variable}} placeholders for anything the AI tool should fill in…'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Spinner className='mr-2' />}
            {mode === 'create' ? 'Create promptTemplate' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
