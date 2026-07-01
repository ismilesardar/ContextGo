import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { IntegrationsViewPage } from '@/features/account-setting/components/integrations-view-page';

export const metadata: Metadata = {
  title: `Account - Integrations - ${APP_NAME}`
};

export default async function Page() {
  return <IntegrationsViewPage />;
}
