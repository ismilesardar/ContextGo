import { APP_NAME } from '@/config/url.config';
import { VerifyEmailView } from '@/features/auth/components/verify-email-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Verify ${APP_NAME} account | ${APP_NAME}`,
  description: 'Authentication forms built using the components.'
};

const page = () => {
  return <VerifyEmailView />;
};

export default page;
