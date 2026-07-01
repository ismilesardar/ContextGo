import { APP_NAME } from '@/config/url.config';
import { CheckEmailView } from '@/features/auth/components/check-email-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Check your email for ${APP_NAME} account verify | ${APP_NAME}`,
  description: 'Authentication forms built using the components.'
};

export default async function Page({
  params
}: {
  params: Promise<{ type: string }>;
}) {
  const resolvedParams = await params;
  return <CheckEmailView params={resolvedParams} />;
}
