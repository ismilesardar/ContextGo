import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { WorkspaceSettingPage } from '@/features/workspace/components/workspace-setting-page';

export const metadata: Metadata = {
  title: `Settings - ${APP_NAME}`
};

const Page = () => {
  return <WorkspaceSettingPage />;
};

export default Page;
