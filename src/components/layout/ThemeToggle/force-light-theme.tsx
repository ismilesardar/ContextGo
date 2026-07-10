'use client';

import { useLayoutEffect } from 'react';

export function ForceLightTheme({ children }: { children: React.ReactNode }) {
  /*
   * Tailwind's `dark:` variant matches `:is(.dark *)` against ANY ancestor,
   * so re-declaring design-token CSS variables here isn't enough — a
   * component using an explicit `dark:*` class still fires as long as
   * <html> carries `dark`. next-themes' `forcedTheme` also isn't reliable
   * here: it races the root ThemeProvider's own effect for control of the
   * same <html> element and can lose. Removing the class directly (and
   * restoring it on unmount) is the only thing that actually wins.
   */
  useLayoutEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    root.classList.remove('dark');
    root.classList.add('light');
    return () => {
      root.classList.remove('light');
      if (hadDark) root.classList.add('dark');
    };
  }, []);

  return (
    <div className='force-light bg-background text-foreground min-h-screen'>
      {children}
    </div>
  );
}
