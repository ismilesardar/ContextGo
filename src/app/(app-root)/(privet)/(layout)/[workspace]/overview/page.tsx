import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import UnifiedOverviewView from '@/features/overview/components/unified-overview-view';

export const metadata: Metadata = {
  title: `Overview - ${APP_NAME}`
};

export default function DashboardPage() {
  return <UnifiedOverviewView />;
}
