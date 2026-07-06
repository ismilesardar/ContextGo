'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type {
  LibraryResourceType,
  LibrarySourceCategory
} from './library-copy';
import { RESOURCE_TYPE_QUERY_KEY } from './library-copy';

export interface LibraryTemplateSummary {
  id: string;
  source: string;
  sourcePath: string;
  sourceCategory: LibrarySourceCategory;
  sourceUrl: string;
  title: string;
  description: string | null;
  tags: string[];
  suggestedResourceType: LibraryResourceType;
  lastSyncedAt: string;
}

export interface LibraryTemplateDetail extends LibraryTemplateSummary {
  content: string;
  frontmatter: Record<string, unknown> | null;
  contentHash: string;
  createdAt: string;
}

interface UseLibraryTemplatesFilters {
  category?: LibrarySourceCategory;
  search?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}

export interface LibraryTemplatesPage {
  templates: LibraryTemplateSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useLibraryTemplates(filters: UseLibraryTemplatesFilters = {}) {
  return useQuery({
    queryKey: [
      'library-templates',
      filters.category,
      filters.search,
      filters.tag,
      filters.page,
      filters.pageSize
    ],
    queryFn: async () => {
      return axios.get<LibraryTemplatesPage, LibraryTemplatesPage>(
        '/api/library/templates',
        { params: filters }
      );
    },
    placeholderData: (previousData) => previousData
  });
}

export function useLibraryTemplate(templateId: string | undefined) {
  return useQuery({
    queryKey: ['library-template', templateId],
    queryFn: async () => {
      const data = await axios.get<
        { template: LibraryTemplateDetail },
        { template: LibraryTemplateDetail }
      >(`/api/library/templates/${templateId}`);
      return data.template;
    },
    enabled: !!templateId
  });
}

export interface ImportLibraryTemplateInput {
  templateId: string;
  projectId: string;
  resourceType: LibraryResourceType;
  titleOverride?: string;
  includeAttribution?: boolean;
}

export interface ImportLibraryTemplateResult {
  id: string;
  resourceType: LibraryResourceType;
  title: string;
}

export function useImportLibraryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      ...values
    }: ImportLibraryTemplateInput) => {
      const data = await axios.post<
        { resource: ImportLibraryTemplateResult },
        { resource: ImportLibraryTemplateResult }
      >(`/api/library/templates/${templateId}/import`, values);
      return data.resource;
    },
    onSuccess: (resource, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          RESOURCE_TYPE_QUERY_KEY[variables.resourceType],
          variables.projectId
        ]
      });
      toast.success(`"${resource.title}" imported`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to import template');
    }
  });
}

export function useSyncLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data = await axios.post<
        { summary: Record<string, number> },
        { summary: Record<string, number> }
      >('/api/library/sync');
      return data.summary;
    },
    onSuccess: (summary) => {
      queryClient.invalidateQueries({ queryKey: ['library-templates'] });
      toast.success(
        `Sync complete — ${summary.upserted} updated, ${summary.skippedUnchanged} unchanged`
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to sync library');
    }
  });
}
