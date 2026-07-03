'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import { useWorkspaceStore } from '@/store';
import type { ProjectFormValues } from '@/lib/zod-schema/project-schema';

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'archived';
  archivedAt: string | null;
  deletedAt: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface UseProjectsFilters {
  status?: 'active' | 'archived';
  search?: string;
}

export function useProjects(filters: UseProjectsFilters = {}) {
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  return useQuery({
    queryKey: ['projects', activeWorkspace?.id, filters.status, filters.search],
    queryFn: async () => {
      const data = await axios.get<
        { projects: Project[] },
        { projects: Project[] }
      >('/api/projects', { params: filters });
      return data.projects;
    },
    enabled: !!activeWorkspace?.id
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const data = await axios.get<
        { project: Project; access: { role: string; isOrgAdmin: boolean } },
        { project: Project; access: { role: string; isOrgAdmin: boolean } }
      >(`/api/projects/${projectId}`);
      return data;
    },
    enabled: !!projectId
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  return useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const data = await axios.post<{ project: Project }, { project: Project }>(
        '/api/projects',
        values
      );
      return data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', activeWorkspace?.id]
      });
      toast.success('Project created');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to create project');
    }
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  return useMutation({
    mutationFn: async (values: Partial<ProjectFormValues>) => {
      const data = await axios.patch<
        { project: Project },
        { project: Project }
      >(`/api/projects/${projectId}`, values);
      return data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', activeWorkspace?.id]
      });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Project updated');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to update project');
    }
  });
}

export function useArchiveProject(projectId: string) {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  return useMutation({
    mutationFn: async (status: 'active' | 'archived') => {
      const data = await axios.patch<
        { project: Project },
        { project: Project }
      >(`/api/projects/${projectId}`, { status });
      return data.project;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', activeWorkspace?.id]
      });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success(
        project.status === 'archived'
          ? 'Project archived'
          : 'Project unarchived'
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update project status'
      );
    }
  });
}

export function useDeleteProject(projectId: string) {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', activeWorkspace?.id]
      });
      toast.success('Project deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete project');
    }
  });
}
