'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useProjects } from '@/features/projects/utils/use-projects';
import { RESOURCE_TYPE_ROUTE_SEGMENT } from '../../utils/library-copy';
import {
  useImportPublicAsset,
  type PublicAssetSummary
} from '../../utils/use-public-assets';

/**
 * Configure-then-import modal for a public asset — mirrors the existing
 * GitHub-synced Library's `ImportTemplateModal`, just against
 * /api/public-assets/[id]/import instead of /api/library/templates.
 */
function PublicAssetImportModalHelper({
  workspaceSlug,
  asset,
  showModal,
  setShowModal
}: {
  workspaceSlug: string;
  asset: PublicAssetSummary;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');

  const { data: projects } = useProjects({ status: 'active' });
  const importAsset = useImportPublicAsset();

  function handleImport() {
    if (!projectId) return;
    importAsset.mutate(
      { assetId: asset.id, projectId, resourceType: asset.resourceType },
      {
        onSuccess: (resource) => {
          setShowModal(false);
          router.push(
            `/${workspaceSlug}/projects/${projectId}/${RESOURCE_TYPE_ROUTE_SEGMENT[asset.resourceType]}/${resource.id}/edit`
          );
        }
      }
    );
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-md'
    >
      <div className='space-y-4 px-4 py-4 sm:px-6'>
        <div>
          <h3 className='text-lg font-medium'>Import "{asset.title}"</h3>
          <p className='text-sm text-neutral-500'>
            This will copy this public asset into a project of your choice.
          </p>
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium'>Project</label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a project' />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='outline' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={!projectId || importAsset.isPending}
            onClick={handleImport}
          >
            {importAsset.isPending && <Spinner className='mr-2' />}
            Import
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

export function usePublicAssetImportModal({
  workspaceSlug
}: {
  workspaceSlug: string;
}) {
  const [asset, setAsset] = useState<PublicAssetSummary | null>(null);

  const openImportModal = useCallback((next: PublicAssetSummary) => {
    setAsset(next);
  }, []);

  const PublicAssetImportModal = useCallback(() => {
    if (!asset) return null;
    return (
      <PublicAssetImportModalHelper
        workspaceSlug={workspaceSlug}
        asset={asset}
        showModal={!!asset}
        setShowModal={() => setAsset(null)}
      />
    );
  }, [workspaceSlug, asset]);

  return useMemo(
    () => ({ openImportModal, PublicAssetImportModal }),
    [openImportModal, PublicAssetImportModal]
  );
}
