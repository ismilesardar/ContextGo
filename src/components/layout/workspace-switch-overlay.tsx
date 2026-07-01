'use client';

import { useWorkspaceStore } from '@/store';
import { Spinner } from '@/components/ui/spinner';

export function WorkspaceSwitchOverlay() {
  const isSwitching = useWorkspaceStore((state) => state.isSwitchingWorkspace);

  if (!isSwitching) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px] dark:bg-neutral-950/60'>
      <div className='bg-card flex flex-col items-center gap-3 rounded-2xl border px-8 py-6 shadow-lg'>
        <Spinner className='size-8' />
        <p className='text-muted-foreground text-sm font-medium'>
          Switching workspace...
        </p>
      </div>
    </div>
  );
}
