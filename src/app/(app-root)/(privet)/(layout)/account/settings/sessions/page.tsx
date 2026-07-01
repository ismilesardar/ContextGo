import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { SessionsViewPage } from '@/features/account-setting/components/sessions-view-page';

export const metadata: Metadata = {
  title: `Account - Sessions - ${APP_NAME}`
};

export default async function Page() {
  return <SessionsViewPage />;
}
