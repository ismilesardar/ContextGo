'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type { ContextFormValues } from '@/lib/zod-schema/context-schema';

export interface ContextAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface Context {
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
  createdBy: ContextAuthor;
  updatedById: string;
  updatedBy: ContextAuthor;
  createdAt: string;
  updatedAt: string;
}

interface UseContextsFilters {
  status?: 'draft' | 'published';
  search?: string;
}

export function useContexts(
  projectId: string | undefined,
  filters: UseContextsFilters = {}
) {
  return useQuery({
    queryKey: ['contexts', projectId, filters.status, filters.search],
    queryFn: async () => {
      const data = await axios.get<
        { contexts: Context[] },
        { contexts: Context[] }
      >(`/api/projects/${projectId}/contexts`, { params: filters });
      return data.contexts;
    },
    enabled: !!projectId
  });
}

export function useContextDetail(
  projectId: string | undefined,
  contextId: string | undefined
) {
  return useQuery({
    queryKey: ['context', projectId, contextId],
    queryFn: async () => {
      const data = await axios.get<{ context: Context }, { context: Context }>(
        `/api/projects/${projectId}/contexts/${contextId}`
      );
      return data.context;
    },
    enabled: !!projectId && !!contextId
  });
}

export function useCreateContext(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ContextFormValues) => {
      const data = await axios.post<{ context: Context }, { context: Context }>(
        `/api/projects/${projectId}/contexts`,
        values
      );
      return data.context;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts', projectId] });
      toast.success('Context created');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to create context');
    }
  });
}

export function useUpdateContext(projectId: string, contextId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<ContextFormValues>) => {
      const data = await axios.patch<
        { context: Context },
        { context: Context }
      >(`/api/projects/${projectId}/contexts/${contextId}`, values);
      return data.context;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['context', projectId, contextId]
      });
      toast.success('Saved as a new version — set it as main to make it live');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to update context');
    }
  });
}

export function usePublishContext(projectId: string, contextId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const data = await axios.patch<
        { context: Context },
        { context: Context }
      >(`/api/projects/${projectId}/contexts/${contextId}`, { status });
      return data.context;
    },
    onSuccess: (context) => {
      queryClient.invalidateQueries({ queryKey: ['contexts', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['context', projectId, contextId]
      });
      toast.success(
        context.status === 'published'
          ? 'Context published'
          : 'Context unpublished'
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update context status'
      );
    }
  });
}

export function useDeleteContext(projectId: string, contextId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/projects/${projectId}/contexts/${contextId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contexts', projectId] });
      toast.success('Context deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete context');
    }
  });
}

export interface ContextVersion {
  id: string;
  contextId: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  createdById: string;
  createdBy: ContextAuthor;
  createdAt: string;
}

export function useContextVersions(
  projectId: string | undefined,
  contextId: string | undefined
) {
  return useQuery({
    queryKey: ['context-versions', projectId, contextId],
    queryFn: async () => {
      const data = await axios.get<
        {
          versions: ContextVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        },
        {
          versions: ContextVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        }
      >(`/api/projects/${projectId}/contexts/${contextId}/versions`);
      return data;
    },
    enabled: !!projectId && !!contextId
  });
}

export function useSetMainContextVersion(projectId: string, contextId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const data = await axios.post<{ context: Context }, { context: Context }>(
        `/api/projects/${projectId}/contexts/${contextId}/versions/${versionId}/set-main`
      );
      return data.context;
    },
    onSuccess: (context) => {
      queryClient.invalidateQueries({ queryKey: ['contexts', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['context', projectId, contextId]
      });
      queryClient.invalidateQueries({
        queryKey: ['context-versions', projectId, contextId]
      });
      toast.success(`Version ${context.mainVersion?.version} set as main`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to set main version');
    }
  });
}

export function useDeleteContextVersion(projectId: string, contextId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      await axios.delete(
        `/api/projects/${projectId}/contexts/${contextId}/versions/${versionId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['context-versions', projectId, contextId]
      });
      toast.success('Version deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete version');
    }
  });
}
