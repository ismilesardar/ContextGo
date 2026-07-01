import { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import WorkspaceView from '@/features/onboarding/components/workspace-view';

export const metadata: Metadata = {
  title: `${APP_NAME} - The Modern Link Attribution Platform`,
  description: 'The Modern Link Attribution Platform'
};

function page() {
  return <WorkspaceView />;
}

export default page;
