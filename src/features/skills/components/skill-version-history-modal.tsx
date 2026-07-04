'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RichTextViewer } from '@/components/editor/rich-text-viewer';
import {
  useSkillVersions,
  useSetMainSkillVersion,
  useDeleteSkillVersion
} from '../utils/use-skills';

export function SkillVersionHistoryModal({
  projectId,
  skillId,
  canManage,
  showModal,
  setShowModal
}: {
  projectId: string;
  skillId: string;
  canManage: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isLoading } = useSkillVersions(projectId, skillId);
  const setMainVersion = useSetMainSkillVersion(projectId, skillId);
  const deleteVersion = useDeleteSkillVersion(projectId, skillId);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const versions = data?.versions ?? [];
  const mainVersionId = data?.mainVersionId ?? null;

  useEffect(() => {
    if (!showModal) return;
    const stillExists = versions.some((v) => v.id === selectedVersionId);
    if (!stillExists) {
      setSelectedVersionId(mainVersionId ?? versions[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, mainVersionId, versions]);

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);
  const isSelectedMain = selectedVersionId === mainVersionId;

  async function handleSetMain() {
    if (!selectedVersionId) return;
    await setMainVersion.mutateAsync(selectedVersionId);
  }

  async function handleDelete() {
    if (!selectedVersionId) return;
    await deleteVersion.mutateAsync(selectedVersionId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setSelectedVersionId(mainVersionId);
      }
    });
  }

  return (
    <>
      <CustomModal
        showModal={showModal}
        setShowModal={setShowModal}
        className='sm:max-w-2xl'
      >
        <div className='space-y-1 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
          <h3 className='text-lg font-medium'>Version history</h3>
          <p className='text-sm text-neutral-500'>
            Pick a version to preview it, then set it as Main to make it the
            active version — nothing is renumbered, the Main tag just moves.
          </p>
        </div>

        <div className='space-y-4 px-4 py-4 sm:px-6'>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <Spinner />
            </div>
          ) : versions.length === 0 ? (
            <p className='text-muted-foreground py-8 text-center text-sm'>
              No version history yet.
            </p>
          ) : (
            <>
              <Select
                value={selectedVersionId ?? undefined}
                onValueChange={setSelectedVersionId}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a version' />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      Version {version.version}
                      {version.id === mainVersionId ? ' · Main' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedVersion && (
                <div className='max-h-[45vh] overflow-y-auto rounded-lg border border-neutral-200 p-4 dark:border-neutral-700'>
                  <div className='mb-3 flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-6'>
                        <AvatarImage
                          src={selectedVersion.createdBy.image ?? undefined}
                        />
                        <AvatarFallback>
                          {selectedVersion.createdBy.name
                            .slice(0, 1)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className='text-muted-foreground text-xs'>
                        {selectedVersion.createdBy.name} ·{' '}
                        {new Date(selectedVersion.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {isSelectedMain && <Badge variant='outline'>Main</Badge>}
                  </div>
                  <p className='mb-2 text-sm font-medium'>
                    {selectedVersion.title}
                  </p>
                  <RichTextViewer content={selectedVersion.content} />
                </div>
              )}

              {canManage && (
                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='destructive'
                    disabled={
                      isSelectedMain ||
                      versions.length <= 1 ||
                      deleteVersion.isPending
                    }
                    title={
                      isSelectedMain
                        ? 'Set a different version as main before deleting this one'
                        : versions.length <= 1
                          ? 'A skill must always have at least one version'
                          : undefined
                    }
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete version
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={isSelectedMain || setMainVersion.isPending}
                    onClick={handleSetMain}
                  >
                    {setMainVersion.isPending && <Spinner className='mr-2' />}
                    Set as main version
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className='flex justify-end gap-2 border-t border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
          <Button variant='outline' onClick={() => setShowModal(false)}>
            Close
          </Button>
        </div>
      </CustomModal>

      <CustomModal
        showModal={showDeleteConfirm}
        setShowModal={setShowDeleteConfirm}
        className='sm:max-w-md'
      >
        <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
          <h3 className='text-lg font-medium'>
            Delete version {selectedVersion?.version}?
          </h3>
          <p className='text-sm text-neutral-500'>
            This permanently deletes this version snapshot. This action cannot
            be undone.
          </p>
        </div>
        <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
          <Button variant='outline' onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteVersion.isPending}
          >
            {deleteVersion.isPending && <Spinner className='mr-2' />}
            Delete
          </Button>
        </div>
      </CustomModal>
    </>
  );
}
