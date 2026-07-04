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
  checklistSchema,
  type ChecklistFormValues
} from '@/lib/zod-schema/checklist-schema';
import {
  useCreateChecklist,
  useUpdateChecklist,
  type Checklist
} from '../utils/use-checklists';

/**
 * Shared create/edit form for a resource type. Create shows title +
 * description + RichTextEditor content in one form (a title is required to
 * create the row at all); edit shows content only — title/description are
 * edited separately via ChecklistDetailsModal.
 */
export function ChecklistForm({
  mode,
  checklist,
  workspaceSlug,
  projectId
}: {
  mode: 'create' | 'edit';
  checklist?: Checklist;
  workspaceSlug: string;
  projectId: string;
}) {
  const router = useRouter();
  const createChecklist = useCreateChecklist(projectId);
  const updateChecklist = useUpdateChecklist(projectId, checklist?.id ?? '');

  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      title: checklist?.title ?? '',
      description: checklist?.description ?? '',
      content: checklist?.content ?? ''
    }
  });

  const isLoading = createChecklist.isPending || updateChecklist.isPending;

  async function onSubmit(values: ChecklistFormValues) {
    if (mode === 'create') {
      await createChecklist.mutateAsync(values, {
        onSuccess: (created) => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/checklists/${created.id}`
          );
        }
      });
    } else if (checklist) {
      await updateChecklist.mutateAsync(values, {
        onSuccess: () => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/checklists/${checklist.id}`
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
                    <Input placeholder='e.g. Release Checklist' {...field} />
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
                      placeholder='A short summary of what this checklist covers'
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
                  placeholder='List each step as a checkbox, e.g. "- [ ] Run the test suite"…'
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
            {mode === 'create' ? 'Create checklist' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
