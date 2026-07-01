import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PaymentSuccessView } from '@/features/billing/components/success/payment-success-view';

export const metadata: Metadata = {
  title: `Payment Success - ${APP_NAME}`
};

export default async function Page() {
  return <PaymentSuccessView />;
}
