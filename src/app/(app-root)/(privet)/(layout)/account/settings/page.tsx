import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ProfileViewPage } from '@/features/account-setting/components/profile-view-page';

export const metadata: Metadata = {
  title: `Account Settings - ${APP_NAME}`
};

export default async function Page() {
  return <ProfileViewPage />;
}
