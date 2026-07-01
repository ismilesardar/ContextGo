import { APP_NAME } from '@/config/url.config';
import WelcomeView from '@/features/onboarding/components/welcome-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} - The Modern Link Attribution Platform`,
  description: 'The Modern Link Attribution Platform'
};

function Page() {
  return <WelcomeView />;
}

export default Page;
