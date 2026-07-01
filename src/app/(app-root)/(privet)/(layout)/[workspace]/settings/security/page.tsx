import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { WorkspaceSecurityView } from '@/features/workspace/components/workspace-security-view';

export const metadata: Metadata = {
  title: `Settings - Security - ${APP_NAME}`
};

const page = () => {
  return <WorkspaceSecurityView />;
};

export default page;
