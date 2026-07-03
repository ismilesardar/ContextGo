'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type {
  ProjectMemberFormValues,
  ProjectMemberRoleValues
} from '@/lib/zod-schema/project-schema';

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'member' | 'viewer';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export function useProjectMembers(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const data = await axios.get<
        { members: ProjectMember[] },
        { members: ProjectMember[] }
      >(`/api/projects/${projectId}/members`);
      return data.members;
    },
    enabled: !!projectId
  });
}

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProjectMemberFormValues) => {
      const data = await axios.post<
        { member: ProjectMember },
        { member: ProjectMember }
      >(`/api/projects/${projectId}/members`, values);
      return data.member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId]
      });
      toast.success('Member added to project');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to add member');
    }
  });
}

export function useUpdateProjectMemberRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      role
    }: {
      memberId: string;
      role: ProjectMemberRoleValues['role'];
    }) => {
      const data = await axios.patch<
        { member: ProjectMember },
        { member: ProjectMember }
      >(`/api/projects/${projectId}/members/${memberId}`, { role });
      return data.member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId]
      });
      toast.success('Member role updated');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update member role'
      );
    }
  });
}

export function useRemoveProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      await axios.delete(`/api/projects/${projectId}/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId]
      });
      toast.success('Member removed from project');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to remove member');
    }
  });
}
