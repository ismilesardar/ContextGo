'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useWorkspaceStore } from '@/store';

/**
 * Refreshes the active workspace in the Zustand store whenever the user
 * navigates to a different route under [workspace]. This ensures token
 * balances and other organization data are always up-to-date without
 * polling or modifying every mutation's onSuccess.
 */
export function WorkspaceRouteRefresher() {
  const pathname = usePathname();
  // Track the previous path so we skip the very first render (data is already fresh).
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (prevPath.current === null) {
      // First mount — skip, data was just loaded by WorkspaceInitializer
      prevPath.current = pathname;
      return;
    }

    prevPath.current = pathname;

    const { activeWorkspace, refreshActiveWorkspace } =
      useWorkspaceStore.getState();
    if (activeWorkspace?.id) {
      refreshActiveWorkspace({
        id: activeWorkspace.id,
        slug: activeWorkspace.slug
      });
    }
  }, [pathname]);

  return null;
}
