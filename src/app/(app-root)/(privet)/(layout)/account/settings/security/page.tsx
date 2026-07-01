import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { SecurityViewPage } from '@/features/account-setting/components/security-view-page';

export const metadata: Metadata = {
  title: `Account - Security - ${APP_NAME}`
};

export default async function Page() {
  return <SecurityViewPage />;
}
