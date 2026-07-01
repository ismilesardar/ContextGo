import { APP_NAME } from '@/config/url.config';
import { RegisterView } from '@/features/auth/components/register-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Create your ${APP_NAME} account | ${APP_NAME}`,
  description: 'Authentication forms built using the components.'
};

export default function Page() {
  return <RegisterView />;
}
