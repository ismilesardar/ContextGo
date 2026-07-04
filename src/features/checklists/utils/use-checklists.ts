'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type { ChecklistFormValues } from '@/lib/zod-schema/checklist-schema';

export interface ChecklistAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface Checklist {
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
  createdBy: ChecklistAuthor;
  updatedById: string;
  updatedBy: ChecklistAuthor;
  createdAt: string;
  updatedAt: string;
}

interface UseChecklistsFilters {
  status?: 'draft' | 'published';
  search?: string;
}

export function useChecklists(
  projectId: string | undefined,
  filters: UseChecklistsFilters = {}
) {
  return useQuery({
    queryKey: ['checklists', projectId, filters.status, filters.search],
    queryFn: async () => {
      const data = await axios.get<
        { checklists: Checklist[] },
        { checklists: Checklist[] }
      >(`/api/projects/${projectId}/checklists`, { params: filters });
      return data.checklists;
    },
    enabled: !!projectId
  });
}

export function useChecklistDetail(
  projectId: string | undefined,
  checklistId: string | undefined
) {
  return useQuery({
    queryKey: ['checklist', projectId, checklistId],
    queryFn: async () => {
      const data = await axios.get<
        { checklist: Checklist },
        { checklist: Checklist }
      >(`/api/projects/${projectId}/checklists/${checklistId}`);
      return data.checklist;
    },
    enabled: !!projectId && !!checklistId
  });
}

export function useCreateChecklist(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ChecklistFormValues) => {
      const data = await axios.post<
        { checklist: Checklist },
        { checklist: Checklist }
      >(`/api/projects/${projectId}/checklists`, values);
      return data.checklist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', projectId] });
      toast.success('Checklist created');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to create checklist');
    }
  });
}

export function useUpdateChecklist(projectId: string, checklistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<ChecklistFormValues>) => {
      const data = await axios.patch<
        { checklist: Checklist },
        { checklist: Checklist }
      >(`/api/projects/${projectId}/checklists/${checklistId}`, values);
      return data.checklist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['checklist', projectId, checklistId]
      });
      toast.success('Saved as a new version — set it as main to make it live');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to update checklist');
    }
  });
}

export function usePublishChecklist(projectId: string, checklistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const data = await axios.patch<
        { checklist: Checklist },
        { checklist: Checklist }
      >(`/api/projects/${projectId}/checklists/${checklistId}`, { status });
      return data.checklist;
    },
    onSuccess: (checklist) => {
      queryClient.invalidateQueries({ queryKey: ['checklists', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['checklist', projectId, checklistId]
      });
      toast.success(
        checklist.status === 'published'
          ? 'Checklist published'
          : 'Checklist unpublished'
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update checklist status'
      );
    }
  });
}

export function useDeleteChecklist(projectId: string, checklistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/projects/${projectId}/checklists/${checklistId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', projectId] });
      toast.success('Checklist deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete checklist');
    }
  });
}

export interface ChecklistVersion {
  id: string;
  checklistId: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  createdById: string;
  createdBy: ChecklistAuthor;
  createdAt: string;
}

export function useChecklistVersions(
  projectId: string | undefined,
  checklistId: string | undefined
) {
  return useQuery({
    queryKey: ['checklist-versions', projectId, checklistId],
    queryFn: async () => {
      const data = await axios.get<
        {
          versions: ChecklistVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        },
        {
          versions: ChecklistVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        }
      >(`/api/projects/${projectId}/checklists/${checklistId}/versions`);
      return data;
    },
    enabled: !!projectId && !!checklistId
  });
}

export function useSetMainChecklistVersion(
  projectId: string,
  checklistId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const data = await axios.post<
        { checklist: Checklist },
        { checklist: Checklist }
      >(
        `/api/projects/${projectId}/checklists/${checklistId}/versions/${versionId}/set-main`
      );
      return data.checklist;
    },
    onSuccess: (checklist) => {
      queryClient.invalidateQueries({ queryKey: ['checklists', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['checklist', projectId, checklistId]
      });
      queryClient.invalidateQueries({
        queryKey: ['checklist-versions', projectId, checklistId]
      });
      toast.success(`Version ${checklist.mainVersion?.version} set as main`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to set main version');
    }
  });
}

export function useDeleteChecklistVersion(
  projectId: string,
  checklistId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      await axios.delete(
        `/api/projects/${projectId}/checklists/${checklistId}/versions/${versionId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['checklist-versions', projectId, checklistId]
      });
      toast.success('Version deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete version');
    }
  });
}
