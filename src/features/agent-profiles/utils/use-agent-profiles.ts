'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type { AgentProfileFormValues } from '@/lib/zod-schema/agent-profile-schema';

export interface AgentProfileAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface AgentProfile {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'published';
  createdById: string;
  createdBy: AgentProfileAuthor;
  updatedById: string;
  updatedBy: AgentProfileAuthor;
  createdAt: string;
  updatedAt: string;
  _count?: { resources: number };
}

export type AgentProfileResourceType =
  | 'context'
  | 'instruction'
  | 'skill'
  | 'prompt_template'
  | 'checklist';

export interface ResolvedAgentProfileResource {
  id: string;
  resourceType: AgentProfileResourceType;
  order: number;
  resource: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: string;
    updatedAt: string;
  } | null;
}

export interface AgentProfileDetail extends AgentProfile {
  resources: ResolvedAgentProfileResource[];
}

interface UseAgentProfilesFilters {
  status?: 'draft' | 'published';
  search?: string;
}

export function useAgentProfiles(
  projectId: string | undefined,
  filters: UseAgentProfilesFilters = {}
) {
  return useQuery({
    queryKey: ['agent-profiles', projectId, filters.status, filters.search],
    queryFn: async () => {
      const data = await axios.get<
        { agentProfiles: AgentProfile[] },
        { agentProfiles: AgentProfile[] }
      >(`/api/projects/${projectId}/agent-profiles`, { params: filters });
      return data.agentProfiles;
    },
    enabled: !!projectId
  });
}

export function useAgentProfileDetail(
  projectId: string | undefined,
  agentProfileId: string | undefined
) {
  return useQuery({
    queryKey: ['agent-profile', projectId, agentProfileId],
    queryFn: async () => {
      const data = await axios.get<
        { agentProfile: AgentProfileDetail },
        { agentProfile: AgentProfileDetail }
      >(`/api/projects/${projectId}/agent-profiles/${agentProfileId}`);
      return data.agentProfile;
    },
    enabled: !!projectId && !!agentProfileId
  });
}

export function useCreateAgentProfile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AgentProfileFormValues) => {
      const data = await axios.post<
        { agentProfile: AgentProfile },
        { agentProfile: AgentProfile }
      >(`/api/projects/${projectId}/agent-profiles`, values);
      return data.agentProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agent-profiles', projectId]
      });
      toast.success('Agent profile created');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to create agent profile'
      );
    }
  });
}

export function useUpdateAgentProfile(
  projectId: string,
  agentProfileId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<AgentProfileFormValues>) => {
      const data = await axios.patch<
        { agentProfile: AgentProfile },
        { agentProfile: AgentProfile }
      >(`/api/projects/${projectId}/agent-profiles/${agentProfileId}`, values);
      return data.agentProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agent-profiles', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['agent-profile', projectId, agentProfileId]
      });
      toast.success('Agent profile updated');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update agent profile'
      );
    }
  });
}

export function usePublishAgentProfile(
  projectId: string,
  agentProfileId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const data = await axios.patch<
        { agentProfile: AgentProfile },
        { agentProfile: AgentProfile }
      >(`/api/projects/${projectId}/agent-profiles/${agentProfileId}`, {
        status
      });
      return data.agentProfile;
    },
    onSuccess: (agentProfile) => {
      queryClient.invalidateQueries({
        queryKey: ['agent-profiles', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['agent-profile', projectId, agentProfileId]
      });
      toast.success(
        agentProfile.status === 'published'
          ? 'Agent profile published'
          : 'Agent profile unpublished'
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update agent profile status'
      );
    }
  });
}

export function useDeleteAgentProfile(
  projectId: string,
  agentProfileId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/projects/${projectId}/agent-profiles/${agentProfileId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agent-profiles', projectId]
      });
      toast.success('Agent profile deleted');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to delete agent profile'
      );
    }
  });
}

export function useSetAgentProfileResources(
  projectId: string,
  agentProfileId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      resources: {
        resourceType: AgentProfileResourceType;
        resourceId: string;
      }[]
    ) => {
      const data = await axios.put<
        { agentProfile: AgentProfileDetail },
        { agentProfile: AgentProfileDetail }
      >(
        `/api/projects/${projectId}/agent-profiles/${agentProfileId}/resources`,
        {
          resources
        }
      );
      return data.agentProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agent-profiles', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['agent-profile', projectId, agentProfileId]
      });
      toast.success('Resources updated');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to update resources');
    }
  });
}
