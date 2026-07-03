'use client';

import { useEffect } from 'react';
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
import { createSlug } from '@/utils/create-slug';
import {
  projectSchema,
  type ProjectFormValues
} from '@/lib/zod-schema/project-schema';
import {
  useCreateProject,
  useUpdateProject,
  type Project
} from '../utils/use-projects';

interface ProjectFormDialogProps {
  mode: 'create' | 'edit';
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectFormDialog({
  mode,
  project,
  open,
  onOpenChange
}: ProjectFormDialogProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(project?.id ?? '');

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? '',
      slug: project?.slug ?? '',
      description: project?.description ?? ''
    }
  });

  const watchedName = form.watch('name');

  useEffect(() => {
    if (mode !== 'create' || !watchedName) return;
    form.setValue('slug', createSlug(watchedName), {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [watchedName, mode, form]);

  useEffect(() => {
    if (open) {
      form.reset({
        name: project?.name ?? '',
        slug: project?.slug ?? '',
        description: project?.description ?? ''
      });
    }
  }, [open, project, form]);

  const isLoading = createProject.isPending || updateProject.isPending;

  async function onSubmit(values: ProjectFormValues) {
    if (mode === 'create') {
      await createProject.mutateAsync(values, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      await updateProject.mutateAsync(values, {
        onSuccess: () => onOpenChange(false)
      });
    }
  }

  return (
    <CustomModal
      showModal={open}
      setShowModal={(value) =>
        onOpenChange(
          typeof value === 'function'
            ? (value as (prev: boolean) => boolean)(open)
            : value
        )
      }
      className='sm:max-w-lg'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>
          {mode === 'create' ? 'Create project' : 'Edit project'}
        </h3>
        <p className='text-sm text-neutral-500'>
          {mode === 'create'
            ? 'Give your project a name to get started.'
            : 'Update your project details.'}
        </p>
      </div>

      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-4 py-4 sm:px-6'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input placeholder='Enter project name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project slug</FormLabel>
              <FormControl>
                <Input placeholder='project-slug' {...field} />
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
                  placeholder='What is this project about?'
                  rows={3}
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Spinner className='mr-2' />}
            {mode === 'create' ? 'Create project' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </CustomModal>
  );
}
