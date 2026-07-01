import { APP_NAME } from '@/config/url.config';
import { ForgotPasswordView } from '@/features/auth/components/forgot-password-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Forget Password for ${APP_NAME} | ${APP_NAME}`,
  description: 'Authentication forms built using the components.'
};

function Page() {
  return <ForgotPasswordView />;
}

export default Page;
