import { WorkspaceRouteRefresher } from '@/components/layout/workspace-route-refresher';

export default function WorkspaceLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WorkspaceRouteRefresher />
      {children}
    </>
  );
}
