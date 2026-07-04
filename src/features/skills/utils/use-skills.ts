'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type { SkillFormValues } from '@/lib/zod-schema/skill-schema';

export interface SkillAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface Skill {
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
  createdBy: SkillAuthor;
  updatedById: string;
  updatedBy: SkillAuthor;
  createdAt: string;
  updatedAt: string;
}

interface UseSkillsFilters {
  status?: 'draft' | 'published';
  search?: string;
}

export function useSkills(
  projectId: string | undefined,
  filters: UseSkillsFilters = {}
) {
  return useQuery({
    queryKey: ['skills', projectId, filters.status, filters.search],
    queryFn: async () => {
      const data = await axios.get<{ skills: Skill[] }, { skills: Skill[] }>(
        `/api/projects/${projectId}/skills`,
        { params: filters }
      );
      return data.skills;
    },
    enabled: !!projectId
  });
}

export function useSkillDetail(
  projectId: string | undefined,
  skillId: string | undefined
) {
  return useQuery({
    queryKey: ['skill', projectId, skillId],
    queryFn: async () => {
      const data = await axios.get<{ skill: Skill }, { skill: Skill }>(
        `/api/projects/${projectId}/skills/${skillId}`
      );
      return data.skill;
    },
    enabled: !!projectId && !!skillId
  });
}

export function useCreateSkill(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: SkillFormValues) => {
      const data = await axios.post<{ skill: Skill }, { skill: Skill }>(
        `/api/projects/${projectId}/skills`,
        values
      );
      return data.skill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', projectId] });
      toast.success('Skill created');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to create skill');
    }
  });
}

export function useUpdateSkill(projectId: string, skillId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<SkillFormValues>) => {
      const data = await axios.patch<{ skill: Skill }, { skill: Skill }>(
        `/api/projects/${projectId}/skills/${skillId}`,
        values
      );
      return data.skill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['skill', projectId, skillId]
      });
      toast.success('Saved as a new version — set it as main to make it live');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to update skill');
    }
  });
}

export function usePublishSkill(projectId: string, skillId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const data = await axios.patch<{ skill: Skill }, { skill: Skill }>(
        `/api/projects/${projectId}/skills/${skillId}`,
        { status }
      );
      return data.skill;
    },
    onSuccess: (skill) => {
      queryClient.invalidateQueries({ queryKey: ['skills', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['skill', projectId, skillId]
      });
      toast.success(
        skill.status === 'published' ? 'Skill published' : 'Skill unpublished'
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update skill status'
      );
    }
  });
}

export function useDeleteSkill(projectId: string, skillId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/projects/${projectId}/skills/${skillId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', projectId] });
      toast.success('Skill deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete skill');
    }
  });
}

export interface SkillVersion {
  id: string;
  skillId: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  createdById: string;
  createdBy: SkillAuthor;
  createdAt: string;
}

export function useSkillVersions(
  projectId: string | undefined,
  skillId: string | undefined
) {
  return useQuery({
    queryKey: ['skill-versions', projectId, skillId],
    queryFn: async () => {
      const data = await axios.get<
        {
          versions: SkillVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        },
        {
          versions: SkillVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        }
      >(`/api/projects/${projectId}/skills/${skillId}/versions`);
      return data;
    },
    enabled: !!projectId && !!skillId
  });
}

export function useSetMainSkillVersion(projectId: string, skillId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const data = await axios.post<{ skill: Skill }, { skill: Skill }>(
        `/api/projects/${projectId}/skills/${skillId}/versions/${versionId}/set-main`
      );
      return data.skill;
    },
    onSuccess: (skill) => {
      queryClient.invalidateQueries({ queryKey: ['skills', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['skill', projectId, skillId]
      });
      queryClient.invalidateQueries({
        queryKey: ['skill-versions', projectId, skillId]
      });
      toast.success(`Version ${skill.mainVersion?.version} set as main`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to set main version');
    }
  });
}

export function useDeleteSkillVersion(projectId: string, skillId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      await axios.delete(
        `/api/projects/${projectId}/skills/${skillId}/versions/${versionId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['skill-versions', projectId, skillId]
      });
      toast.success('Version deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete version');
    }
  });
}
