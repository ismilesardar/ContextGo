'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';

export type ProjectApiKeyResourceType =
  | 'context'
  | 'instruction'
  | 'skill'
  | 'prompt_template'
  | 'checklist'
  | 'agent_profile';

export interface ProjectApiKeyAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface ProjectApiKey {
  id: string;
  projectId: string;
  mcpIdentityId: string;
  mcpIdentity: { id: string; name: string };
  name: string;
  keyPrefix: string;
  secret: string | null;
  createdById: string;
  createdBy: ProjectApiKeyAuthor;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  allowedIp: string | null;
}

export interface CreateProjectApiKeyInput {
  name: string;
  mcpIdentityId: string;
}

export function useProjectApiKeys(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-api-keys', projectId],
    queryFn: async () => {
      const data = await axios.get<
        { apiKeys: ProjectApiKey[] },
        { apiKeys: ProjectApiKey[] }
      >(`/api/projects/${projectId}/mcp/keys`);
      return data.apiKeys;
    },
    enabled: !!projectId
  });
}

export function useCreateProjectApiKey(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateProjectApiKeyInput) => {
      const data = await axios.post<
        { apiKey: ProjectApiKey; secret: string },
        { apiKey: ProjectApiKey; secret: string }
      >(`/api/projects/${projectId}/mcp/keys`, values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-api-keys', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['project-mcp-identities', projectId]
      });
      toast.success('API key created');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to create API key');
    }
  });
}

export function useRevokeProjectApiKey(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyId: string) => {
      const data = await axios.post<
        { apiKey: ProjectApiKey },
        { apiKey: ProjectApiKey }
      >(`/api/projects/${projectId}/mcp/keys/${keyId}/revoke`);
      return data.apiKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-api-keys', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['project-mcp-identities', projectId]
      });
      toast.success('API key revoked');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to revoke API key');
    }
  });
}

export function useResetProjectApiKeyIp(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyId: string) => {
      const data = await axios.post<
        { apiKey: ProjectApiKey },
        { apiKey: ProjectApiKey }
      >(`/api/projects/${projectId}/mcp/keys/${keyId}/reset-ip`);
      return data.apiKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-api-keys', projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ['project-mcp-identities', projectId]
      });
      toast.success(
        'IP binding reset — the next request from any IP will re-pin it'
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to reset IP binding');
    }
  });
}
