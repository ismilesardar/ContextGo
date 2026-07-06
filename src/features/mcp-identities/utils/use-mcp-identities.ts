'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';

export interface McpIdentityAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface McpIdentity {
  id: string;
  organizationId: string;
  name: string;
  createdById: string;
  createdBy: McpIdentityAuthor;
  createdAt: string;
  _count?: { grants: number; apiKeys: number };
}

export function useMcpIdentities() {
  return useQuery({
    queryKey: ['mcp-identities'],
    queryFn: async () => {
      const data = await axios.get<
        { identities: McpIdentity[] },
        { identities: McpIdentity[] }
      >('/api/mcp-identities');
      return data.identities;
    }
  });
}

export function useCreateMcpIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: { name: string }) => {
      const data = await axios.post<
        { identity: McpIdentity },
        { identity: McpIdentity }
      >('/api/mcp-identities', values);
      return data.identity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-identities'] });
      toast.success('MCP User created');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to create MCP User');
    }
  });
}

export function useDeleteMcpIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identityId: string) => {
      await axios.delete(`/api/mcp-identities/${identityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-identities'] });
      toast.success('MCP User deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete MCP User');
    }
  });
}
