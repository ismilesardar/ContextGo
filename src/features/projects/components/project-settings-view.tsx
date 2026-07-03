'use client';

import { useEffect } from 'react';
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
import { PageShell } from '@/components/layout/page-shell';
import {
  projectSchema,
  type ProjectFormValues
} from '@/lib/zod-schema/project-schema';
import {
  useArchiveProject,
  useProject,
  useUpdateProject,
  type Project
} from '../utils/use-projects';
import { ProjectMembersSection } from './project-members-section';
import { useDeleteProjectModal } from './delete-project-modal';

export function ProjectSettingsView({
  workspaceSlug,
  projectId
}: {
  workspaceSlug: string;
  projectId: string;
}) {
  const { data, isLoading } = useProject(projectId);
  const project = data?.project;
  const canManage = data?.access?.isOrgAdmin === true;

  const updateProject = useUpdateProject(projectId);
  const archiveProject = useArchiveProject(projectId);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', slug: '', description: '' }
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        slug: project.slug,
        description: project.description ?? ''
      });
    }
  }, [project, form]);

  return (
    <PageShell
      title='Project Settings'
      description="Manage this project's details, access, and lifecycle."
      showDate={false}
      isLoading={isLoading}
      maxWidth='max-w-3xl'
    >
      <Card className='rounded-xl p-6'>
        <Form
          form={form}
          onSubmit={form.handleSubmit((values) => updateProject.mutate(values))}
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!canManage} />
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
                  <Input {...field} disabled={!canManage} />
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
                  <Textarea rows={3} {...field} disabled={!canManage} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {canManage && (
            <div className='flex justify-end'>
              <Button type='submit' disabled={updateProject.isPending}>
                {updateProject.isPending && <Spinner className='mr-2' />}
                Save changes
              </Button>
            </div>
          )}
        </Form>
      </Card>

      {project && (
        <ProjectMembersSection projectId={projectId} canManage={canManage} />
      )}

      {canManage && project && (
        <Card className='rounded-xl border-red-200 p-0'>
          <div className='space-y-1 p-6'>
            <h2 className='text-base font-semibold'>
              {project.status === 'archived'
                ? 'Unarchive project'
                : 'Archive project'}
            </h2>
            <p className='text-muted-foreground text-sm'>
              {project.status === 'archived'
                ? 'Restore this project to make it active again.'
                : 'Archived projects are hidden from the active list but not deleted.'}
            </p>
          </div>
          <div className='flex items-center justify-end border-t border-red-200 bg-red-50 px-6 py-3 dark:bg-red-700/10'>
            <Button
              variant='outline'
              onClick={() =>
                archiveProject.mutate(
                  project.status === 'archived' ? 'active' : 'archived'
                )
              }
              disabled={archiveProject.isPending}
            >
              {archiveProject.isPending && <Spinner className='mr-2' />}
              {project.status === 'archived' ? 'Unarchive' : 'Archive'}
            </Button>
          </div>
        </Card>
      )}

      {canManage && project && (
        <ProjectDeleteSection project={project} workspaceSlug={workspaceSlug} />
      )}
    </PageShell>
  );
}

function ProjectDeleteSection({
  project,
  workspaceSlug
}: {
  project: Project;
  workspaceSlug: string;
}) {
  const { setShowDeleteProjectModal, DeleteProjectModal } =
    useDeleteProjectModal({ project, workspaceSlug });

  return (
    <>
      <Card className='rounded-xl border-red-200 p-0'>
        <div className='space-y-1 p-6'>
          <h2 className='text-base font-semibold'>Delete project</h2>
          <p className='text-muted-foreground text-sm'>
            Permanently delete this project and all of its data. This action
            cannot be undone.
          </p>
        </div>
        <div className='flex items-center justify-end border-t border-red-200 bg-red-50 px-6 py-3 dark:bg-red-700/10'>
          <Button
            variant='destructive'
            onClick={() => setShowDeleteProjectModal(true)}
          >
            Delete project
          </Button>
        </div>
      </Card>

      <DeleteProjectModal />
    </>
  );
}
