import { APP_NAME } from '@/config/url.config';
import { LoginView } from '@/features/auth/components/login-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Sing in to ${APP_NAME} | ${APP_NAME}`,
  description: 'Authentication forms built using the components.'
};

export default function Page() {
  return <LoginView />;
}
