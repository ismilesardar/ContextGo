'use client';

import { useMemo, useState } from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Icons } from '@/components/icons';
import { useWorkspaceStore } from '@/store';
import { useAddProjectMember } from '../utils/use-project-members';
import type { ProjectMember } from '../utils/use-project-members';
import type { ProjectMemberFormValues } from '@/lib/zod-schema/project-schema';

export function AddProjectMemberDialog({
  projectId,
  existingMembers
}: {
  projectId: string;
  existingMembers: ProjectMember[];
}) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<ProjectMemberFormValues['role']>('member');

  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const addMember = useAddProjectMember(projectId);

  const existingUserIds = useMemo(
    () => new Set(existingMembers.map((m) => m.userId)),
    [existingMembers]
  );

  const availableMembers = useMemo(
    () =>
      (activeWorkspace?.members ?? []).filter(
        (m) => !existingUserIds.has(m.userId)
      ),
    [activeWorkspace?.members, existingUserIds]
  );

  async function handleSubmit() {
    if (!userId) return;
    await addMember.mutateAsync(
      { userId, role },
      {
        onSuccess: () => {
          setOpen(false);
          setUserId('');
          setRole('member');
        }
      }
    );
  }

  return (
    <>
      <Button variant='outline' size='sm' onClick={() => setOpen(true)}>
        <Icons.userPlus className='mr-2 size-4' />
        Add member
      </Button>

      <CustomModal
        showModal={open}
        setShowModal={(value) =>
          setOpen(
            typeof value === 'function'
              ? (value as (prev: boolean) => boolean)(open)
              : value
          )
        }
        className='sm:max-w-md'
      >
        <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
          <h3 className='text-lg font-medium'>Add project member</h3>
          <p className='text-sm text-neutral-500'>
            Grant a workspace member access to this project. Only granted
            members can see or open it.
          </p>
        </div>

        <div className='space-y-4 px-4 py-4 sm:px-6'>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a workspace member' />
            </SelectTrigger>
            <SelectContent>
              {availableMembers.length === 0 ? (
                <div className='text-muted-foreground px-3 py-2 text-sm'>
                  All workspace members already have access.
                </div>
              ) : (
                availableMembers.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.user?.name ?? m.user?.email ?? m.userId}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select
            value={role}
            onValueChange={(value) =>
              setRole(value as ProjectMemberFormValues['role'])
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='member'>Member</SelectItem>
              <SelectItem value='viewer'>Viewer</SelectItem>
            </SelectContent>
          </Select>

          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!userId || addMember.isPending}
            >
              {addMember.isPending && <Spinner className='mr-2' />}
              Add member
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
