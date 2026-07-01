import { ModalProvider } from '@/components/ui/modal/modal-provider';
import ReactQueryProviders from '@/lib/api-setting/react-query-provider';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProviders>
      <ModalProvider>
        <div className='overflow-hidden! overscroll-none!'>{children}</div>
      </ModalProvider>
    </ReactQueryProviders>
  );
}
