'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type { InstructionFormValues } from '@/lib/zod-schema/instruction-schema';

export interface InstructionAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface Instruction {
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
  createdBy: InstructionAuthor;
  updatedById: string;
  updatedBy: InstructionAuthor;
  createdAt: string;
  updatedAt: string;
}

interface UseInstructionsFilters {
  status?: 'draft' | 'published';
  search?: string;
}

export function useInstructions(
  projectId: string | undefined,
  filters: UseInstructionsFilters = {}
) {
  return useQuery({
    queryKey: ['instructions', projectId, filters.status, filters.search],
    queryFn: async () => {
      const data = await axios.get<
        { instructions: Instruction[] },
        { instructions: Instruction[] }
      >(`/api/projects/${projectId}/instructions`, { params: filters });
      return data.instructions;
    },
    enabled: !!projectId
  });
}

export function useInstructionDetail(
  projectId: string | undefined,
  instructionId: string | undefined
) {
  return useQuery({
    queryKey: ['instruction', projectId, instructionId],
    queryFn: async () => {
      const data = await axios.get<
        { instruction: Instruction },
        { instruction: Instruction }
      >(`/api/projects/${projectId}/instructions/${instructionId}`);
      return data.instruction;
    },
    enabled: !!projectId && !!instructionId
  });
}

export function useCreateInstruction(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: InstructionFormValues) => {
      const data = await axios.post<
        { instruction: Instruction },
        { instruction: Instruction }
      >(`/api/projects/${projectId}/instructions`, values);
      return data.instruction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions', projectId] });
      toast.success('Instruction created');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to create instruction'
      );
    }
  });
}

export function useUpdateInstruction(projectId: string, instructionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<InstructionFormValues>) => {
      const data = await axios.patch<
        { instruction: Instruction },
        { instruction: Instruction }
      >(`/api/projects/${projectId}/instructions/${instructionId}`, values);
      return data.instruction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['instruction', projectId, instructionId]
      });
      toast.success('Saved as a new version — set it as main to make it live');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update instruction'
      );
    }
  });
}

export function usePublishInstruction(
  projectId: string,
  instructionId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const data = await axios.patch<
        { instruction: Instruction },
        { instruction: Instruction }
      >(`/api/projects/${projectId}/instructions/${instructionId}`, { status });
      return data.instruction;
    },
    onSuccess: (instruction) => {
      queryClient.invalidateQueries({ queryKey: ['instructions', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['instruction', projectId, instructionId]
      });
      toast.success(
        instruction.status === 'published'
          ? 'Instruction published'
          : 'Instruction unpublished'
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update instruction status'
      );
    }
  });
}

export function useDeleteInstruction(projectId: string, instructionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/projects/${projectId}/instructions/${instructionId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructions', projectId] });
      toast.success('Instruction deleted');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to delete instruction'
      );
    }
  });
}

export interface InstructionVersion {
  id: string;
  instructionId: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  createdById: string;
  createdBy: InstructionAuthor;
  createdAt: string;
}

export function useInstructionVersions(
  projectId: string | undefined,
  instructionId: string | undefined
) {
  return useQuery({
    queryKey: ['instruction-versions', projectId, instructionId],
    queryFn: async () => {
      const data = await axios.get<
        {
          versions: InstructionVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        },
        {
          versions: InstructionVersion[];
          mainVersionId: string | null;
          latestVersion: number;
        }
      >(`/api/projects/${projectId}/instructions/${instructionId}/versions`);
      return data;
    },
    enabled: !!projectId && !!instructionId
  });
}

export function useSetMainInstructionVersion(
  projectId: string,
  instructionId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const data = await axios.post<
        { instruction: Instruction },
        { instruction: Instruction }
      >(
        `/api/projects/${projectId}/instructions/${instructionId}/versions/${versionId}/set-main`
      );
      return data.instruction;
    },
    onSuccess: (instruction) => {
      queryClient.invalidateQueries({ queryKey: ['instructions', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['instruction', projectId, instructionId]
      });
      queryClient.invalidateQueries({
        queryKey: ['instruction-versions', projectId, instructionId]
      });
      toast.success(`Version ${instruction.mainVersion?.version} set as main`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to set main version');
    }
  });
}

export function useDeleteInstructionVersion(
  projectId: string,
  instructionId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      await axios.delete(
        `/api/projects/${projectId}/instructions/${instructionId}/versions/${versionId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['instruction-versions', projectId, instructionId]
      });
      toast.success('Version deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete version');
    }
  });
}
