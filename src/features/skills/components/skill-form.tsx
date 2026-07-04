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
  skillSchema,
  type SkillFormValues
} from '@/lib/zod-schema/skill-schema';
import {
  useCreateSkill,
  useUpdateSkill,
  type Skill
} from '../utils/use-skills';

/**
 * Shared create/edit form for a resource type. Create shows title +
 * description + RichTextEditor content in one form (a title is required to
 * create the row at all); edit shows content only — title/description are
 * edited separately via SkillDetailsModal.
 */
export function SkillForm({
  mode,
  skill,
  workspaceSlug,
  projectId
}: {
  mode: 'create' | 'edit';
  skill?: Skill;
  workspaceSlug: string;
  projectId: string;
}) {
  const router = useRouter();
  const createSkill = useCreateSkill(projectId);
  const updateSkill = useUpdateSkill(projectId, skill?.id ?? '');

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: skill?.title ?? '',
      description: skill?.description ?? '',
      content: skill?.content ?? ''
    }
  });

  const isLoading = createSkill.isPending || updateSkill.isPending;

  async function onSubmit(values: SkillFormValues) {
    if (mode === 'create') {
      await createSkill.mutateAsync(values, {
        onSuccess: (created) => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/skills/${created.id}`
          );
        }
      });
    } else if (skill) {
      await updateSkill.mutateAsync(values, {
        onSuccess: () => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/skills/${skill.id}`
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
                    <Input placeholder='e.g. Code Review Process' {...field} />
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
                      placeholder='A short summary of what this skill covers'
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
                  placeholder='Document the knowledge this skill should capture…'
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
            {mode === 'create' ? 'Create skill' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
