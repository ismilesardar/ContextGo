'use client';

import Cookies from 'js-cookie';
import { Icons } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateWorkspaceButton } from '@/features/workspace/components/organization-view/create-workspace-button';
import { useUserSession } from '@/hooks/use-client-session';
import { authClient } from '@/lib/auth/auth-client';
import { useWorkspaceStore } from '@/store';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { Organization } from 'better-auth/plugins';
import Link from 'next/link';
import { useCallback, useContext, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getActiveWorkspace } from '@/lib/api/workspace/get-workspace-details';
import { BlurImage } from '@/components/ui/blur-image';
import { cn } from '@/lib/utils';
import { CustomPopover } from '@/components/ui/custom-popover';
import { User } from '@/lib/auth/auth';
import { pluralize } from '@/utils/functions/pluralize';
import { usePlansStore } from '@/store/workspace-store/plan-store';
import { Button } from '@/components/ui/button';
import { ModalContext } from '@/components/ui/modal/modal-provider';
import { queryClient } from '@/lib/api-setting/react-query';

export const WorkspaceAction = () => {
  const { user, isLoading } = useUserSession();

  const { activeWorkspace, workspaces: workspaceList } = useWorkspaceStore(
    (state) => state
  );

  const [openPopover, setOpenPopover] = useState(false);

  if (!activeWorkspace || isLoading) {
    return <WorkspaceDropdownPlaceholder />;
  }

  return (
    <CustomPopover
      content={
        <WorkspaceList
          user={user}
          workspaces={workspaceList}
          setOpenPopover={setOpenPopover}
        />
      }
      side='right'
      align='start'
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      <button
        onClick={() => setOpenPopover(!openPopover)}
        className={cn(
          'flex size-11 items-center justify-center rounded-lg p-1.5 text-left text-sm transition-all duration-75',
          'hover:bg-neutral-300/70 active:bg-neutral-200/10 data-[state=open]:bg-neutral-200/10 dark:hover:bg-neutral-600/70',
          'outline-none focus-visible:ring-2 focus-visible:ring-black/50'
        )}
      >
        <BlurImage
          src={activeWorkspace.logo || `/assets/avatars/workspace.png`}
          referrerPolicy='no-referrer'
          width={28}
          height={28}
          alt={activeWorkspace.name}
          className='size-7 flex-none shrink-0 overflow-hidden rounded-full'
          draggable={false}
        />
      </button>
    </CustomPopover>
  );
};

function WorkspaceDropdownPlaceholder() {
  return (
    <div className='flex size-11 animate-pulse items-center gap-x-1.5 rounded-lg bg-white dark:bg-neutral-700' />
  );
}

function WorkspaceList({
  user,
  workspaces,
  setOpenPopover
}: {
  user: User | null;
  workspaces: Organization[];
  setOpenPopover: (open: boolean) => void;
}) {
  const { setShowAddWorkspaceModal } = useContext(ModalContext);
  const { link, programId } = useParams() as {
    link: string | string[];
    programId?: string;
  };

  const router = useRouter();
  const pathname = usePathname();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { activeWorkspace, addActiveMember, setSwitchingWorkspace } =
    useWorkspaceStore();
  const { refreshPlans } = usePlansStore();
  const membersCount = activeWorkspace?.members.length ?? 0;

  const href = useCallback(
    (slug: string) => {
      if (link) {
        // if we're on a link page, navigate back to the workspace root
        return `/${slug}/overview`;
      } else if (activeWorkspace?.slug) {
        // else, we keep the path but remove all query params
        return (
          pathname.replace(activeWorkspace.slug, slug).split('?')[0] || '/'
        );
      } else {
        return '/';
      }
    },
    [link, programId, pathname, activeWorkspace?.slug]
  );

  async function handleSwitchWorkspace(workspace: Organization) {
    if (workspace) {
      // Signal all pages to show loading skeletons
      setSwitchingWorkspace(true);
      setActiveWorkspaceName(workspace.slug);

      const { data: activeWorkspaceData, error } = await getActiveWorkspace({
        slug: workspace.slug
      });

      if (error) {
        // return window.location.reload();
        if (error?.code === 'USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION') {
          toast.error('Access denied! you are not part of the workspace.');

          const fallbackSlug = user?.defaultWorkspace;

          if (fallbackSlug) {
            // Send to their actual workspace
            window.location.href = `/${fallbackSlug}/overview`;
          } else {
            // If they deleted their last workspace, send to onboarding
            window.location.href = '/onboarding/workspace';
          }
        }
      }

      if (activeWorkspaceData && user) {
        // set active workspace in backend to update user session
        await authClient.organization.setActive(
          { organizationId: workspace.id },
          {
            onSuccess: async () => {
              // Find the current user's role in this workspace
              // const currentMember = activeWorkspaceData.members.find(
              //   (m: any) => m.userId === user.id
              // );
              const { data: currentMember } =
                await authClient.organization.getActiveMember();

              addActiveMember(currentMember || null);
              refreshPlans(activeWorkspaceData.id);

              // Invalidate all React Query caches — every feature refetches for the new workspace
              queryClient.invalidateQueries();

              // Clear switching state after queries have had time to refetch
              setTimeout(() => {
                setSwitchingWorkspace(false);
              }, 2000);

              Cookies.set('active_member', JSON.stringify(currentMember), {
                expires: 7,
                path: '/'
              });
            },
            onError: (error) => {
              toast.error(error.error.message || 'Failed to switch workspace');
            }
          }
        );
      }
    }
  }

  return (
    <div className='relative w-full min-w-72'>
      <div
        ref={scrollRef}
        className='bg-card relative max-h-85 w-full overflow-hidden rounded-md text-base sm:text-sm dark:bg-neutral-800'
      >
        {/* Current workspace section */}
        <div className='flex flex-col gap-2.5 border-b border-neutral-200 px-3 pb-3 sm:p-3'>
          <div className='flex items-center gap-x-2.5'>
            <BlurImage
              src={activeWorkspace?.logo || `/assets/avatars/workspace.png`}
              width={28}
              height={28}
              alt={activeWorkspace?.name || 'Workspace Avatar'}
              className='size-9 shrink-0 overflow-hidden rounded-full sm:size-8'
              draggable={false}
            />
            <div className='min-w-0'>
              <div className='truncate text-base leading-5 font-medium text-neutral-900 sm:text-sm dark:text-neutral-100'>
                {activeWorkspace?.name}
              </div>
              {activeWorkspace?.slug && (
                <div
                  className={cn(
                    'truncate text-sm leading-tight text-neutral-900 capitalize sm:text-xs dark:text-neutral-400/80',
                    getPlanColor(activeWorkspace?.plan || 'free')
                  )}
                >
                  {activeWorkspace?.plan}
                  {membersCount > 0
                    ? ` · ${membersCount} ${pluralize('member', membersCount)}`
                    : ''}
                </div>
              )}
            </div>
          </div>

          {/* Settings and Invite members options */}
          <div className='flex flex-row gap-1'>
            <Link
              href={`/${activeWorkspace?.slug ? activeWorkspace.slug : 'account'}/settings`}
              className='flex items-center justify-start gap-x-2 rounded-lg border border-neutral-200 px-2 py-1 text-neutral-700 transition-all duration-75 outline-none hover:bg-neutral-100/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80 dark:text-neutral-200'
              onClick={() => setOpenPopover(false)}
            >
              <Icons.settings className='size-4.5' />
              <span className='block truncate text-sm'>Settings</span>
            </Link>
            {activeWorkspace?.slug && (
              <Link
                href={`/${activeWorkspace.slug}/settings/members`}
                className='flex items-center justify-start gap-x-2 rounded-lg border border-neutral-200 px-2 py-1 text-neutral-700 transition-all duration-75 outline-none hover:bg-neutral-100/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80 dark:text-neutral-200'
                onClick={() => setOpenPopover(false)}
              >
                <Icons.userPlus className='size-4.5' />
                <span className='block truncate text-sm'>Invite members</span>
              </Link>
            )}
          </div>
        </div>

        {/* Workspaces section */}
        <div className='p-1'>
          <p className='px-2 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400'>
            Workspaces
          </p>
          <ScrollArea className='flex max-h-40 flex-col gap-0.5 overflow-y-auto'>
            {workspaces.map((workspace) => {
              const { id, name, slug, logo } = workspace;
              const isActive = activeWorkspace?.slug === slug;
              return (
                <Link
                  key={slug}
                  className={`relative flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 transition-all duration-75 outline-none hover:bg-neutral-200/50 focus-visible:ring-2 focus-visible:ring-black/50 dark:hover:bg-neutral-200/20 ${isActive && 'bg-neutral-200/80 dark:bg-neutral-200/10'}`}
                  // className={cn(
                  //   'relative flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition-all duration-75',
                  //   'hover:bg-neutral-200/50 active:bg-neutral-200/80',
                  //   'outline-none focus-visible:ring-2 focus-visible:ring-black/50',
                  //   isActive && 'bg-neutral-200/50'
                  // )}
                  href={href(slug)}
                  shallow={false}
                  onClick={() => {
                    setOpenPopover(false);
                    handleSwitchWorkspace(workspace);
                  }}
                >
                  <BlurImage
                    src={logo || `/assets/avatars/workspace.png`}
                    width={28}
                    height={28}
                    alt={id}
                    className='size-5 shrink-0 overflow-hidden rounded-full'
                    draggable={false}
                  />
                  <span className='block truncate text-base leading-5 text-neutral-900 sm:max-w-35 sm:text-sm dark:text-neutral-300'>
                    {name}
                  </span>
                  {activeWorkspace?.slug === slug ? (
                    <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-black dark:text-neutral-300'>
                      <Icons.check className='size-4' aria-hidden='true' />
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </ScrollArea>

          {/* <CreateWorkspaceButton onOpen={setOpenPopover} /> */}
          <Button
            onClick={() => {
              setOpenPopover(false);
              setShowAddWorkspaceModal(true);
            }}
            variant='secondary'
            className='my-1 flex w-full cursor-pointer items-center justify-start gap-x-2.5 rounded-md p-2 text-neutral-700 transition-all duration-75 hover:bg-neutral-200/10 dark:text-neutral-300'
          >
            <Icons.add />
            <span className='block truncate'>Create workspace</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const getPlanColor = (plan: string) =>
  plan === 'enterprise'
    ? 'text-purple-700'
    : plan === 'advanced'
      ? 'text-amber-800'
      : plan.startsWith('business')
        ? 'text-blue-900'
        : plan === 'pro'
          ? 'text-cyan-900'
          : 'text-neutral-500';
