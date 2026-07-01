import { APP_NAME } from '@/config/url.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} – AI-Powered Amazon Selling Suite`,
  description:
    'Optimize listings, analyze reviews, ensure compliance, and grow your Amazon business with AI-powered tools.'
};

export default function LandingPageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
