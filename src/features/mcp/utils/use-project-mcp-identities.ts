'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type {
  ProjectApiKey,
  ProjectApiKeyResourceType
} from './use-project-api-keys';

export interface McpIdentityGrant {
  id: string;
  mcpIdentityId: string;
  projectId: string;
  resourceType: ProjectApiKeyResourceType;
  resourceId: string;
}

export interface ProjectMcpIdentity {
  id: string;
  organizationId: string;
  name: string;
  createdById: string;
  createdBy: { id: string; name: string; image: string | null };
  createdAt: string;
  grants: McpIdentityGrant[];
  apiKeys: ProjectApiKey[];
}

export function useProjectMcpIdentities(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-mcp-identities', projectId],
    queryFn: async () => {
      const data = await axios.get<
        { identities: ProjectMcpIdentity[] },
        { identities: ProjectMcpIdentity[] }
      >(`/api/projects/${projectId}/mcp/identities`);
      return data.identities;
    },
    enabled: !!projectId
  });
}

export function useSetMcpIdentityGrants(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      identityId,
      resources
    }: {
      identityId: string;
      resources: {
        resourceType: ProjectApiKeyResourceType;
        resourceId: string;
      }[];
    }) => {
      const data = await axios.put<
        { grants: McpIdentityGrant[] },
        { grants: McpIdentityGrant[] }
      >(`/api/projects/${projectId}/mcp/identities/${identityId}/grants`, {
        resources
      });
      return data.grants;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-mcp-identities', projectId]
      });
      toast.success('Resource access updated');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ?? 'Failed to update resource access'
      );
    }
  });
}
