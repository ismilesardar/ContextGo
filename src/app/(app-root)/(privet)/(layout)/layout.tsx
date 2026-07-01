import KBar from '@/components/kbar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { TokenBanner } from '@/components/layout/token-banner';
import { WorkspaceInitializer } from '@/components/layout/workspace-initializer';
import { WorkspaceSwitchOverlay } from '@/components/layout/workspace-switch-overlay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SessionProvider } from '@/hooks/use-client-session';
import { getServerSession } from '@/lib/auth/auth-session';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { APP_NAME } from '@/config/url.config';

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  // check if user is authenticated, if not redirect to login page
  if (!session?.user) {
    return redirect('/auth/login');
  }

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen =
    cookieStore.get('sidebar_state')?.value === 'true' || true;

  return (
    <KBar>
      <SessionProvider>
        <SidebarProvider
          defaultOpen={defaultOpen}
          className='gap-1 bg-neutral-200/90! dark:bg-neutral-800!'
        >
          <AppSidebar />
          <SidebarInset className='h-[calc(100dvh-15px)]! overflow-hidden! bg-white dark:bg-neutral-950/90'>
            <TokenBanner />
            <Header />
            {/* page main content */}
            <ScrollArea className='h-[calc(100%-64px)] rounded-md'>
              {/* <div className='flex-1 overflow-auto'> */}
              {children}
              {/* </div> */}
            </ScrollArea>
            {/* page main content ends */}
          </SidebarInset>
          <WorkspaceInitializer />
          <WorkspaceSwitchOverlay />
        </SidebarProvider>
      </SessionProvider>
    </KBar>
  );
}
