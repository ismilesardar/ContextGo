'use client';

import { useState } from 'react';
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
import {
  agentProfileSchema,
  type AgentProfileFormValues
} from '@/lib/zod-schema/agent-profile-schema';
import {
  useCreateAgentProfile,
  useUpdateAgentProfile,
  useSetAgentProfileResources,
  type AgentProfileDetail
} from '../utils/use-agent-profiles';
import {
  AgentProfileResourcePicker,
  type PickedResource
} from './agent-profile-resource-picker';

/**
 * Shared create/edit form. Create shows title + description only (an Agent
 * Profile must exist before resources can be attached to it). Edit shows
 * title + description + the resource picker, saved together in one submit —
 * unlike Contexts/Instructions/etc., Agent Profiles have no version history,
 * so an edit updates the live row directly.
 */
export function AgentProfileForm({
  mode,
  agentProfile,
  workspaceSlug,
  projectId
}: {
  mode: 'create' | 'edit';
  agentProfile?: AgentProfileDetail;
  workspaceSlug: string;
  projectId: string;
}) {
  const router = useRouter();
  const createAgentProfile = useCreateAgentProfile(projectId);
  const updateAgentProfile = useUpdateAgentProfile(
    projectId,
    agentProfile?.id ?? ''
  );
  const setResources = useSetAgentProfileResources(
    projectId,
    agentProfile?.id ?? ''
  );

  const [resources, setResourcesState] = useState<PickedResource[]>(
    () =>
      agentProfile?.resources.map((r) => ({
        resourceType: r.resourceType,
        resourceId: r.resource?.id ?? r.id
      })) ?? []
  );

  const form = useForm<AgentProfileFormValues>({
    resolver: zodResolver(agentProfileSchema),
    defaultValues: {
      title: agentProfile?.title ?? '',
      description: agentProfile?.description ?? ''
    }
  });

  const isLoading =
    createAgentProfile.isPending ||
    updateAgentProfile.isPending ||
    setResources.isPending;

  async function onSubmit(values: AgentProfileFormValues) {
    if (mode === 'create') {
      await createAgentProfile.mutateAsync(values, {
        onSuccess: (created) => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/agent-profiles/${created.id}/edit`
          );
        }
      });
    } else if (agentProfile) {
      await updateAgentProfile.mutateAsync(values);
      await setResources.mutateAsync(resources, {
        onSuccess: () => {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/agent-profiles/${agentProfile.id}`
          );
        }
      });
    }
  }

  return (
    <div className='space-y-6'>
      <Card className='rounded-lg p-6'>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Backend Developer' {...field} />
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
                    placeholder='A short summary of this AI role and when to use it'
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === 'edit' && (
            <div className='space-y-3'>
              <h3 className='text-sm font-medium'>Resources</h3>
              <AgentProfileResourcePicker
                projectId={projectId}
                value={resources}
                onChange={setResourcesState}
              />
            </div>
          )}

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Spinner className='mr-2' />}
              {mode === 'create' ? 'Create agent profile' : 'Save changes'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
