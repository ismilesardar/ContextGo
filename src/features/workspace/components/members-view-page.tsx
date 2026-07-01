'use client';

import { Card } from '@/components/ui/card';
import { Suspense, useMemo } from 'react';
import { MemberTable } from './member-table';
import { columns } from './member-table/columns';
import { Spinner } from '@/components/ui/spinner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { InvitationStatus } from 'better-auth/plugins';
import { useParams } from 'next/navigation';
import { useWorkspaceDetails } from '@/lib/api/workspace/get-workspace-details';
import { useWorkspaceStore } from '@/store';

export type MemberRow = {
  id: string;
  organizationId: string;
  role: 'owner' | 'moderator' | 'member' | 'viewer';
  createdAt: Date;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  email?: string;
  status?: InvitationStatus;
  inviterId?: string;
  expiresAt?: Date;
};

export const MembersView = () => {
  // const params = useParams();
  // const workspaceSlug: string = Array.isArray(params.workspace)
  //   ? params.workspace[0]
  //   : (params.workspace ?? '');
  // const { data: response } = useWorkspaceDetails({
  //   workspace: { slug: workspaceSlug }
  // });

  const { activeWorkspace } = useWorkspaceStore();

  const totalMember: MemberRow[] = useMemo(() => {
    if (!activeWorkspace) return [];

    const pendingInvites =
      activeWorkspace?.invitations?.filter(
        (invite) => invite.status === 'pending'
      ) ?? [];

    return [...activeWorkspace.members, ...pendingInvites];
  }, [activeWorkspace?.members, activeWorkspace?.invitations]);

  return (
    <Card className='min-h-[calc(100dvh-100px)] flex-1 rounded-md bg-transparent pt-3 lg:pt-6'>
      <div className='@container/page mx-auto w-full max-w-7xl px-3 lg:px-6'>
        <div className='dark:bg-card min-h-[300px] rounded-xl border border-neutral-200 bg-white p-6 md:px-8 dark:border-neutral-600'>
          <div className='flex items-center justify-center space-y-4'>
            <Suspense
              fallback={
                <DataTableSkeleton
                  columnCount={5}
                  rowCount={6}
                  filterCount={2}
                />
              }
            >
              {totalMember.length ? (
                <MemberTable
                  data={totalMember}
                  totalItems={totalMember.length}
                  columns={columns}
                />
              ) : (
                <Spinner />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </Card>
  );
};
