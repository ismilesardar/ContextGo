'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader
} from '@/components/ui/sidebar';
import {
  accountNavItems,
  navItems,
  pinnedNavItems,
  systemAdminNavItems,
  workspaceNavItems
} from '@/utils/constants/route-list';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { authClient } from '@/lib/auth/auth-client';
import { useUserSession } from '@/hooks/use-client-session';
import { ScrollArea } from '../ui/scroll-area';
import { logoSingle } from '@/config/image-url';
import Image from 'next/image';
import { APP_NAME } from '@/config/url.config';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { ImpersonationIndicator } from '../auth/impersonation-indicator';
import { WorkspaceAction } from '@/features/app-sidebar/components/workspace-action';
import { SideNavItems } from '@/features/app-sidebar/components/side-nav-items';
import { useWorkspaceStore } from '@/store';
import { getSessionData } from '@/utils/save-local';
import { UserDropdown } from '@/features/app-sidebar/components/user-dropdown';
import { useRouteNavigation } from '@/hooks/use-route-navigation';
import { ACCESS_TYPE, ROLES } from '@/utils/constants/organization-const';
import { Spinner } from '../ui/spinner';

export function AppSidebar() {
  const { user } = useUserSession();
  const { currentArea } = useRouteNavigation();
  const params = useParams();
  const activeWorkspaceSlug = getSessionData('last_active_workspace');

  const { activeWorkspace } = useWorkspaceStore((state) => state);

  const workspaceSlug = params?.workspace as string;

  const [userPermission, setHasUserPermission] = React.useState<boolean>(false);

  const sideNavItems = () => {
    switch (currentArea) {
      case 'general':
        return navItems;
      case 'userSettings':
        return accountNavItems;
      case 'workspaceSettings':
        return workspaceNavItems;
      case 'systemAdmin':
        return systemAdminNavItems;
      default:
        return navItems;
    }
  };

  React.useEffect(() => {
    authClient.admin
      .hasPermission({ permissions: { user: ['list'] } })
      .then(({ data }) => {
        setHasUserPermission(data?.success ?? false);
      })
      .catch((error) => {
        setHasUserPermission(false);
      });
  }, [user]);

  const renderNavHeader = () => {
    switch (currentArea) {
      case 'userSettings':
      case 'workspaceSettings':
        return (
          <Link
            className='group/header mb-1 flex items-center gap-3 px-3 pt-2'
            href={activeWorkspace ? `/${activeWorkspace.slug}/overview` : '/'}
          >
            <div className='bg-sidebar-accent-foreground/15 text-secondary-foreground group-hover/header:bg-sidebar-accent-foreground/20 group-hover/header:text-secondary-foreground flex size-6 items-center justify-center rounded-md shadow-xs transition-[transform,background-color,color] duration-150 group-hover/header:-translate-x-0.5'>
              <Icons.chevronLeft className='w-4 group-hover/header:w-5' />
            </div>
            <span className='text-secondary-foreground text-lg font-semibold'>
              Settings
            </span>
          </Link>
        );

      case 'systemAdmin':
        return (
          <h4 className='text-secondary-foreground px-3 pt-2 text-lg font-semibold'>
            System Admin
          </h4>
        );

      default:
        // This acts as your fallback (Short Links)
        return (
          <h4 className='text-secondary-foreground px-3 pt-2 text-lg font-semibold'>
            Short Links
          </h4>
        );
    }
  };

  return (
    <Sidebar collapsible='icon' variant='inset' className='p-1'>
      <div className='grid! w-full grid-cols-5 gap-1 bg-neutral-200/90 dark:bg-neutral-800'>
        <div className='col-span-1 flex flex-col items-center justify-between px-1 py-4'>
          <div className='flex flex-col items-center gap-y-4 px-1'>
            <Link
              className='block overflow-visible rounded-lg px-1 py-1 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-black/50'
              href={
                activeWorkspaceSlug ? `/${activeWorkspaceSlug}/overview` : '/'
              }
            >
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-(--shibsa-brand-color) to-orange-500 shadow-sm transition-shadow group-hover:shadow-md'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M12 2L2 7l10 5 10-5-10-5z' />
                  <path d='M2 17l10 5 10-5' />
                  <path d='M2 12l10 5 10-5' />
                </svg>
              </div>
            </Link>

            {/* workspace model section */}
            <WorkspaceAction />

            {/* admin section */}
            {user?.accessType === ACCESS_TYPE.SYSTEM && (
              <>
                {!user ? (
                  <div className='flex size-11 animate-pulse items-center gap-x-1.5 rounded-lg bg-white dark:bg-neutral-700' />
                ) : (
                  <>
                    <Link
                      href='/system-admin/users'
                      className='flex size-11 items-center justify-center gap-x-1.5 rounded-lg text-sm font-medium hover:bg-white hover:dark:bg-neutral-700'
                      title='Users'
                    >
                      <span className='rounded-full bg-neutral-100 p-1'>
                        <Icons.admin className='size-4 text-blue-700' />
                      </span>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className='flex flex-col items-center gap-2'>
            <ImpersonationIndicator />
            <ModeToggle />

            <UserDropdown />
          </div>
        </div>

        <ScrollArea className='bg-card col-span-4 h-[calc(100dvh-7px)] rounded-xl'>
          <div className='overflow-hidden rounded-xl'>
            <SidebarHeader>
              {/* nav link header */}
              {renderNavHeader()}
            </SidebarHeader>

            <SidebarContent className='overflow-x-hidden'>
              {activeWorkspace ? (
                <SideNavItems
                  navItems={sideNavItems()}
                  pinnedItems={currentArea === 'general' ? pinnedNavItems : []}
                  navType={currentArea}
                  workspaceSlug={workspaceSlug}
                  userPermission={userPermission}
                />
              ) : (
                <div className='item-center flex justify-center py-10'>
                  <Spinner />
                </div>
              )}
            </SidebarContent>
          </div>
          {/* <SidebarRail /> */}
        </ScrollArea>
      </div>
    </Sidebar>
  );
}
