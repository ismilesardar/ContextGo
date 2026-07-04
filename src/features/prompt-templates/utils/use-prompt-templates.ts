'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type { PromptTemplateFormValues } from '@/lib/zod-schema/prompt-template-schema';

export interface PromptTemplateAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface PromptTemplate {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  status: 'draft' | 'published';
  version: number;
  mainVersionId: string | null;
  mainVersion: { id: string; version: number } | null;
  createdById: string;
  createdBy: PromptTemplateAuthor;
  updatedById: string;
  updatedBy: PromptTemplateAuthor;
  createdAt: string;
  updatedAt: string;
}

interface UsePromptTemplatesFilters {
  status?: 'draft' | 'published';
  search?: string;
}

export function usePromptTemplates(
  projectId: string | undefined,
  filters: UsePromptTemplatesFilters = {}
) {
  return useQuery({
    queryKey: ['prompt-templates', projectId, filters.status, filters.search],
    queryFn: async () => {
      const data = await axios.get<
        { promptTemplates: PromptTemplate[] },
        { promptTemplates: PromptTemplate[] }
      >(`/api/projects/${projectId}/prompt-templates`, { params: filters });
      return data.promptTemplates;
    },
    enabled: !!projectId
  });
}

export function usePromptTemplateDetail(
  projectId: string | undefined,
  promptTemplateId: string | undefined
) {
  return useQuery({
    queryKey: ['promptTemplate', projectId, promptTemplateId],
    queryFn: async () => {
      const data = await axios.get<
        { promptTemplate: PromptTemplate },
        { promptTemplate: PromptTemplate }
      >(`/api/projects/${projectId}/prompt-templates/${promptTemplateId}`);
      return data.promptTemplate;
    },
    enabled: !!projectId && !!promptTemplateId
  });
}

export function useCreatePromptTemplate(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: PromptTemplateFormValues) => {
      const data = await axios.post<
        { promptTemplate: PromptTemplate },
        { promptTemplate: PromptTemplate }
      >(`/api/projects/${projectId}/prompt-templates`, values);
      return data.promptTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['prompt-templates', projectId]
      });
      toast.success('Prompt template created');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to create promptTemplate'
      );
    }
  });
}

export function useUpdatePromptTemplate(
  projectId: string,
  promptTemplateId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<PromptTemplateFormValues>) => {
      const data = await axios.patch<
        { promptTemplate: PromptTemplate },
        { promptTemplate: PromptTemplate }
      >(
        `/api/projects/${projectId}/prompt-templates/${promptTemplateId}`,
        values
      );
      return data.promptTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['prompt-templates', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['promptTemplate', projectId, promptTemplateId]
      });
      toast.success('Saved as a new version — set it as main to make it live');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update promptTemplate'
      );
    }
  });
}

export function usePublishPromptTemplate(
  projectId: string,
  promptTemplateId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const data = await axios.patch<
        { promptTemplate: PromptTemplate },
        { promptTemplate: PromptTemplate }
      >(`/api/projects/${projectId}/prompt-templates/${promptTemplateId}`, {
        status
      });
      return data.promptTemplate;
    },
    onSuccess: (promptTemplate) => {
      queryClient.invalidateQueries({
        queryKey: ['prompt-templates', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['promptTemplate', projectId, promptTemplateId]
      });
      toast.success(
        promptTemplate.status === 'published'
          ? 'Prompt template published'
          : 'Prompt template unpublished'
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update promptTemplate status'
      );
    }
  });
}

export function useDeletePromptTemplate(
  projectId: string,
  promptTemplateId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/projects/${projectId}/prompt-templates/${promptTemplateId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['prompt-templates', projectId]
      });
      toast.success('Prompt template deleted');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to delete promptTemplate'
      );
    }
  });
}

export interface PromptTemplateVersion {
  id: string;
  promptTemplateId: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  createdById: string;
  createdBy: PromptTemplateAuthor;
  createdAt: string;
}

export function usePromptTemplateVersions(
  projectId: string | undefined,
  promptTemplateId: string | undefined
) {
  return useQuery({
    queryKey: ['prompt-template-versions', projectId, promptTemplateId],
    queryFn: async () => {
      const data = await axios.get<
        {
          versions: PromptTemplateVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        },
        {
          versions: PromptTemplateVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        }
      >(
        `/api/projects/${projectId}/prompt-templates/${promptTemplateId}/versions`
      );
      return data;
    },
    enabled: !!projectId && !!promptTemplateId
  });
}

export function useSetMainPromptTemplateVersion(
  projectId: string,
  promptTemplateId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const data = await axios.post<
        { promptTemplate: PromptTemplate },
        { promptTemplate: PromptTemplate }
      >(
        `/api/projects/${projectId}/prompt-templates/${promptTemplateId}/versions/${versionId}/set-main`
      );
      return data.promptTemplate;
    },
    onSuccess: (promptTemplate) => {
      queryClient.invalidateQueries({
        queryKey: ['prompt-templates', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['promptTemplate', projectId, promptTemplateId]
      });
      queryClient.invalidateQueries({
        queryKey: ['prompt-template-versions', projectId, promptTemplateId]
      });
      toast.success(
        `Version ${promptTemplate.mainVersion?.version} set as main`
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to set main version');
    }
  });
}

export function useDeletePromptTemplateVersion(
  projectId: string,
  promptTemplateId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      await axios.delete(
        `/api/projects/${projectId}/prompt-templates/${promptTemplateId}/versions/${versionId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['prompt-template-versions', projectId, promptTemplateId]
      });
      toast.success('Version deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete version');
    }
  });
}
