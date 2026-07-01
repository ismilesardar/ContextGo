'use client';

import { useSearchParams } from 'next/navigation';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  createContext,
  useEffect
} from 'react';
import { useAddWorkspaceModal } from './add-workspace-modal';

export const ModalContext = createContext<{
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowAddWorkspaceModal: () => {}
});

export function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ModalProviderClient>{children}</ModalProviderClient>
    </Suspense>
  );
}

function ModalProviderClient({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const { AddWorkspaceModal, setShowAddWorkspaceModal } =
    useAddWorkspaceModal();

  // handle ?newWorkspace and ?newLink query params
  useEffect(() => {
    if (searchParams.has('newWorkspace')) {
      setShowAddWorkspaceModal(true);
    }
  }, []);

  return (
    <ModalContext.Provider
      value={{
        setShowAddWorkspaceModal
      }}
    >
      <AddWorkspaceModal />
      {children}
    </ModalContext.Provider>
  );
}
