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
  instructionSchema,
  type InstructionFormValues
} from '@/lib/zod-schema/instruction-schema';
import {
  useCreateInstruction,
  useUpdateInstruction,
  type Instruction
} from '../utils/use-instructions';

/**
 * Shared create/edit form for a resource type. Create shows title +
 * description + RichTextEditor content in one form (a title is required to
 * create the row at all); edit shows content only — title/description are
 * edited separately via InstructionDetailsModal.
 */
export function InstructionForm({
  mode,
  instruction,
  workspaceSlug,
  projectId
}: {
  mode: 'create' | 'edit';
  instruction?: Instruction;
  workspaceSlug: string;
  projectId: string;
}) {
  const router = useRouter();
  const createInstruction = useCreateInstruction(projectId);
  const updateInstruction = useUpdateInstruction(
    projectId,
    instruction?.id ?? ''
  );

  const form = useForm<InstructionFormValues>({
    resolver: zodResolver(instructionSchema),
    defaultValues: {
      title: instruction?.title ?? '',
      description: instruction?.description ?? '',
      content: instruction?.content ?? ''
    }
  });

  const isLoading = createInstruction.isPending || updateInstruction.isPending;

  async function onSubmit(values: InstructionFormValues) {
    if (mode === 'create') {
      await createInstruction.mutateAsync(values, {
        onSuccess: (created) => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/instructions/${created.id}`
          );
        }
      });
    } else if (instruction) {
      await updateInstruction.mutateAsync(values, {
        onSuccess: () => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/instructions/${instruction.id}`
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
                      placeholder='e.g. API Naming Conventions'
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
                      placeholder='A short summary of what this instruction covers'
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
                  placeholder='Document the knowledge this instruction should capture…'
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
            {mode === 'create' ? 'Create instruction' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
