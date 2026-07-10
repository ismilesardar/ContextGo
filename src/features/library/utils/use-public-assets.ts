'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/api-setting/axios.config';
import type { LibraryResourceType } from './library-copy';
import { RESOURCE_TYPE_QUERY_KEY } from './library-copy';

export interface PublicAssetAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface PublicAssetSummary {
  id: string;
  resourceType: LibraryResourceType;
  title: string;
  slug: string;
  description: string | null;
  createdById: string;
  createdBy: PublicAssetAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface PublicAssetDetail extends PublicAssetSummary {
  content: string;
}

interface UsePublicAssetsFilters {
  resourceType?: LibraryResourceType;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PublicAssetsPage {
  assets: PublicAssetSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PUBLIC_ASSETS_KEY = 'public-assets';

export function usePublicAssets(filters: UsePublicAssetsFilters = {}) {
  return useQuery({
    queryKey: [
      PUBLIC_ASSETS_KEY,
      filters.resourceType,
      filters.search,
      filters.page,
      filters.pageSize
    ],
    queryFn: async () => {
      return axios.get<PublicAssetsPage, PublicAssetsPage>(
        '/api/public-assets',
        { params: filters }
      );
    },
    placeholderData: (previousData) => previousData
  });
}

export function usePublicAsset(assetId: string | undefined) {
  return useQuery({
    queryKey: [PUBLIC_ASSETS_KEY, assetId],
    queryFn: async () => {
      const data = await axios.get<
        { asset: PublicAssetDetail },
        { asset: PublicAssetDetail }
      >(`/api/public-assets/${assetId}`);
      return data.asset;
    },
    enabled: !!assetId
  });
}

export interface CreatePublicAssetInput {
  title: string;
  description?: string;
  content: string;
  resourceType: LibraryResourceType;
}

export function useCreatePublicAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreatePublicAssetInput) => {
      const data = await axios.post<
        { asset: PublicAssetSummary },
        { asset: PublicAssetSummary }
      >('/api/public-assets', values);
      return data.asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUBLIC_ASSETS_KEY] });
      toast.success('Public asset published');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to publish asset');
    }
  });
}

export interface UpdatePublicAssetInput {
  assetId: string;
  title?: string;
  description?: string;
  content?: string;
}

export function useUpdatePublicAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetId, ...values }: UpdatePublicAssetInput) => {
      const data = await axios.patch<
        { asset: PublicAssetSummary },
        { asset: PublicAssetSummary }
      >(`/api/public-assets/${assetId}`, values);
      return data.asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUBLIC_ASSETS_KEY] });
      toast.success('Public asset updated');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to update asset');
    }
  });
}

export function useDeletePublicAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId: string) => {
      await axios.delete(`/api/public-assets/${assetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUBLIC_ASSETS_KEY] });
      toast.success('Public asset deleted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? 'Failed to delete asset');
    }
  });
}

export interface ImportPublicAssetInput {
  assetId: string;
  projectId: string;
  resourceType: LibraryResourceType;
  titleOverride?: string;
}

export interface ImportPublicAssetResult {
  id: string;
  resourceType: LibraryResourceType;
  title: string;
}

export function useImportPublicAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetId, ...values }: ImportPublicAssetInput) => {
      const data = await axios.post<
        { resource: ImportPublicAssetResult },
        { resource: ImportPublicAssetResult }
      >(`/api/public-assets/${assetId}/import`, values);
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
      toast.error(error?.response?.data?.error ?? 'Failed to import asset');
    }
  });
}
