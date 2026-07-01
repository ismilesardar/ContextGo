'use client';

import Cookies from 'js-cookie';
import { AlertModal } from '@/components/ui/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { MemberRow } from '../members-view-page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useWorkspaceStore } from '@/store';
import { queryClient } from '@/lib/api-setting/react-query';
import { ROLES, WORKSPACE_ROLES } from '@/utils/constants/organization-const';
import { useUserSession } from '@/hooks/use-client-session';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  data: MemberRow;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { user } = useUserSession();
  const { hasPermission } = usePermissions();
  const { refreshActiveWorkspace } = useWorkspaceStore();
  const { activeWorkspace, activeMember, addActiveMember } =
    useWorkspaceStore();

  // Workspace permission
  const canUpdate = hasPermission('organization', 'update');

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  function removeMember(memberEmail: string) {
    return authClient.organization.removeMember(
      {
        memberIdOrEmail: memberEmail
      },
      {
        onSuccess: async () => {
          setOpen(false);
          await refreshActiveWorkspace({ id: data.organizationId });
          router.refresh();
        },
        onError(context) {
          toast.error(
            context.error.message || 'something went wrong, try again later!'
          );
        }
      }
    );
  }

  function leaveMember(workspaceId: string) {
    return authClient.organization.leave(
      {
        organizationId: workspaceId
      },
      {
        onSuccess: async () => {
          setOpen(false);
          await refreshActiveWorkspace({ id: data.organizationId });
          router.refresh();
        },
        onError(context) {
          toast.error(
            context.error.message || 'something went wrong, try again later!'
          );
        }
      }
    );
  }

  function removeInvitation(invitationId: string) {
    return authClient.organization.cancelInvitation(
      {
        invitationId: invitationId
      },
      {
        onSuccess: async () => {
          setOpen(false);
          await refreshActiveWorkspace({ id: data.organizationId });
          router.refresh();
        },
        onError(context) {
          toast.error(
            context.error.message || 'something went wrong, try again later!'
          );
        }
      }
    );
  }

  function handelUserRole(role: string) {
    if (!canUpdate) {
      return toast.error('Unauthorized action!');
    }

    if (!role) return;

    setAlertModal(true);
    setUserRole(role);
  }

  const onConfirm = async () => {
    if (!canUpdate) {
      return toast.error('Unauthorized action!');
    }

    if (!userRole) return;

    setLoading(true);

    await authClient.organization.updateMemberRole(
      {
        role: userRole,
        memberId: data.id,
        organizationId: data.organizationId
      },
      {
        onError: (context) => {
          setAlertModal(false);
          setLoading(false);
          setUserRole(null);
          toast.error(context.error.message || 'Something went wrong!');
        },
        onSuccess: async () => {
          setUserRole(null);
          setLoading(false);
          setAlertModal(false);
          toast.success(`User role update successfully!`);
          queryClient.invalidateQueries({ queryKey: ['workspace-details'] });

          if (activeWorkspace && user) {
            // Find the current user's role in this workspace
            // const currentMember = activeWorkspace.members.find(
            //   (m: any) => m.userId === user.id
            // );
            const { data: currentMember } =
              await authClient.organization.getActiveMember();

            addActiveMember(currentMember || null);

            Cookies.set('active_member', JSON.stringify(currentMember), {
              expires: 7,
              path: '/'
            });
          }
        }
      }
    );
  };

  return (
    <>
      <AlertModal
        isOpen={alertModal}
        onClose={() => {
          setAlertModal(false);
          setUserRole(null);
        }}
        onConfirm={onConfirm}
        loading={loading}
        description={`you want to change the role?`}
      />
      <div className='flex items-center justify-between'>
        <Select
          value={data?.role ?? ''}
          disabled={data?.role === ROLES.OWNER || !!data?.status || !canUpdate}
          onValueChange={handelUserRole}
        >
          <SelectTrigger className='w-max'>
            <SelectValue placeholder='Select an organization' />
          </SelectTrigger>
          <SelectContent>
            {WORKSPACE_ROLES.map((org) => (
              <SelectItem key={org.key} value={org.key}>
                {org.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu open={open} onOpenChange={(o) => setOpen(o)}>
          <DropdownMenuTrigger asChild>
            {/* disabled={!canUpdate} */}
            <span
            // className={cn(
            //   !canUpdate ? 'cursor-not-allowed' : 'cursor-pointer'
            // )}
            >
              {/* disabled={!canUpdate} */}
              <Button
                variant='ghost'
                className={cn(
                  'size-8 p-0',
                  data?.role === ROLES.OWNER ? 'hidden' : 'visible'
                  // !canUpdate
                  //   ? 'pointer-events-none opacity-50'
                  //   : 'cursor-pointer'
                )}
              >
                <Icons.dots className='h-4 w-4' />
              </Button>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {activeMember?.role !== ROLES.OWNER ? (
              <DropdownMenuItem
                className='hover:bg-transparent!'
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <BetterAuthActionButton
                  requireAreYouSure
                  variant='destructive'
                  disabled={data.role === ROLES.OWNER}
                  className={`min-w-25 cursor-pointer bg-red-500/10! text-red-400 hover:bg-red-500/25! hover:text-red-400! ${data.role === ROLES.OWNER ? 'cursor-not-allowed!' : 'cursor-pointer'}`}
                  size='sm'
                  action={() => {
                    if (!data?.status) {
                      return Promise.resolve({
                        error: { message: 'User status not found' }
                      });
                    }
                    // Check user permission
                    if (data.role === ROLES.OWNER) {
                      return Promise.resolve({
                        error: { message: 'Unauthorized action!' }
                      });
                    }

                    return leaveMember(data.organizationId);
                  }}
                >
                  <Icons.userMinus className='mr-1 size-5 text-red-400' /> Leave
                  Workspace
                </BetterAuthActionButton>
              </DropdownMenuItem>
            ) : data.status ? (
              <DropdownMenuItem
                className='hover:bg-transparent!'
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <BetterAuthActionButton
                  requireAreYouSure
                  variant='destructive'
                  disabled={!canUpdate}
                  className={`min-w-25 cursor-pointer bg-red-500/10! text-red-400 hover:bg-red-500/25! hover:text-red-400! ${!canUpdate ? 'cursor-not-allowed!' : 'cursor-pointer'}`}
                  size='sm'
                  action={() => {
                    if (!data?.status) {
                      return Promise.resolve({
                        error: { message: 'User status not found' }
                      });
                    }
                    // Check user permission
                    if (!canUpdate) {
                      return Promise.resolve({
                        error: { message: 'Unauthorized action!' }
                      });
                    }

                    return removeInvitation(data.id);
                  }}
                >
                  <Icons.userMinus className='mr-1 size-5 text-red-400' />{' '}
                  Cancel
                </BetterAuthActionButton>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className='hover:bg-transparent!'
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <BetterAuthActionButton
                  requireAreYouSure
                  variant='destructive'
                  disabled={!canUpdate}
                  className={`min-w-25 cursor-pointer bg-red-500/10! text-red-400 hover:bg-red-500/25! hover:text-red-400! ${!canUpdate ? 'cursor-not-allowed!' : 'cursor-pointer'}`}
                  size='sm'
                  action={() => {
                    if (!data?.user?.email) {
                      return Promise.resolve({
                        error: { message: 'User email not found' }
                      });
                    }
                    // Check user permission
                    if (!canUpdate) {
                      return Promise.resolve({
                        error: { message: 'Unauthorized action!' }
                      });
                    }

                    return removeMember(data.user.email);
                  }}
                >
                  <Icons.userMinus className='mr-1 size-5 text-red-400' />{' '}
                  Remove Workspace
                </BetterAuthActionButton>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
