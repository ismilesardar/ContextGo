import { useWorkspaceStore } from '@/store';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

export const useRouteNavigation = () => {
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const slug = activeWorkspace?.slug;

  // const [iSystemAdminRoute, setIsSystemAdminRoute] =
  //   React.useState<boolean>(false);
  // const [isGeneralRoute, setIsGeneralRoute] = React.useState<boolean>(false);
  // const [isUserSettingsRoute, setIsUserSettingsRoute] =
  //   React.useState<boolean>(false);
  // const [isWorkspaceSettingsRoute, setIsWorkspaceSettingsRoute] =
  //   React.useState<boolean>(false);
  // const [navType, setNavType] = React.useState<string>('general');

  // React.useEffect(() => {
  // system-admin
  // const isSystemAdmin =
  //   pathname.endsWith('/system-admin') || pathname.includes('/system-admin/');

  // Logic to determine the type
  // const isUserAccount =
  //   pathname.endsWith('/account') || pathname.includes('/account/');
  // const isWorkspaceSettings =
  //   pathname.endsWith('/settings') || pathname.includes('/settings/');
  // const isGeneral = !isUserAccount && !isWorkspaceSettings;

  // if (isSystemAdmin) setNavType('system-admin');
  // if (isUserAccount) setNavType('user-account');
  // if (isWorkspaceSettings) setNavType('workspace-settings');
  // console.log('pathname',pathname)
  // console.log('isWorkspaceSettings',isWorkspaceSettings)
  // console.log('isUserAccount',isUserAccount)
  //     setIsGeneralRoute(isGeneral);
  //     setIsSystemAdminRoute(isSystemAdmin);
  //     setIsUserSettingsRoute(isUserAccount);
  //     setIsWorkspaceSettingsRoute(isWorkspaceSettings);

  // }, []);

  const currentArea = useMemo(() => {
    return pathname.startsWith('/account/settings')
      ? 'userSettings'
      : pathname.startsWith(`/${slug}/settings`)
        ? 'workspaceSettings'
        : pathname.startsWith(`/system-admin`)
          ? 'systemAdmin'
          : 'general';
  }, [slug, pathname]);

  const isGeneralRoute = currentArea === 'general';
  const iSystemAdminRoute = currentArea === 'systemAdmin';
  const isUserSettingsRoute = currentArea === 'userSettings';
  const isWorkspaceSettingsRoute = currentArea === 'workspaceSettings';

  return {
    isGeneralRoute,
    iSystemAdminRoute,
    isUserSettingsRoute,
    isWorkspaceSettingsRoute,
    currentArea
  };
};
