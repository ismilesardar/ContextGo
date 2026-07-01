import { APP_NAME } from '@/config/url.config';
import { ResetPasswordView } from '@/features/auth/components/reset-password-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} - The Modern Link Attribution Platform`,
  description: 'The Modern Link Attribution Platform'
};

function Page() {
  return <ResetPasswordView />;
}

export default Page;
