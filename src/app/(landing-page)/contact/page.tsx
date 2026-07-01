import { ContactView } from '@/features/contact/contact-view';
import { getServerSession } from '@/lib/auth/auth-session';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const session = await getServerSession();

  if (session?.user) {
    return redirect(
      `${session?.user.defaultWorkspace ? `/${session.user.defaultWorkspace}/overview` : '/onboarding/workspace'}`
    );
  }

  return <ContactView />;
};

export default Page;
