import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { BillingViewPage } from '@/features/billing/components/billing-view-page';

export const metadata: Metadata = {
  title: `Settings - Billing - ${APP_NAME}`
};

export default async function Page() {
  return <BillingViewPage />;
}
