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
  contextSchema,
  type ContextFormValues
} from '@/lib/zod-schema/context-schema';
import {
  useCreateContext,
  useUpdateContext,
  type Context
} from '../utils/use-contexts';

/**
 * Shared create/edit form for a resource type. Create shows title +
 * description + RichTextEditor content in one form (a title is required to
 * create the row at all); edit shows content only — title/description are
 * edited separately via ContextDetailsModal.
 */
export function ContextForm({
  mode,
  context,
  workspaceSlug,
  projectId
}: {
  mode: 'create' | 'edit';
  context?: Context;
  workspaceSlug: string;
  projectId: string;
}) {
  const router = useRouter();
  const createContext = useCreateContext(projectId);
  const updateContext = useUpdateContext(projectId, context?.id ?? '');

  const form = useForm<ContextFormValues>({
    resolver: zodResolver(contextSchema),
    defaultValues: {
      title: context?.title ?? '',
      description: context?.description ?? '',
      content: context?.content ?? ''
    }
  });

  const isLoading = createContext.isPending || updateContext.isPending;

  async function onSubmit(values: ContextFormValues) {
    if (mode === 'create') {
      await createContext.mutateAsync(values, {
        onSuccess: (created) => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/contexts/${created.id}`
          );
        }
      });
    } else if (context) {
      await updateContext.mutateAsync(values, {
        onSuccess: () => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/contexts/${context.id}`
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
                    <Input
                      placeholder='e.g. Frontend Architecture'
                      {...field}
                    />
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
                      placeholder='A short summary of what this context covers'
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
                  placeholder='Document the knowledge this context should capture…'
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
            {mode === 'create' ? 'Create context' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
