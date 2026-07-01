import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { UpgradeView } from '@/features/billing/components/upgrade/upgrade-view';

export const metadata: Metadata = {
  title: `Upgrade Plan - ${APP_NAME}`
};

export default async function Page() {
  return <UpgradeView />;
}
