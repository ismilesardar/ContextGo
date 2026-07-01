import {
  Navbar,
  Hero,
  TrustedBy,
  HowItWorks,
  Testimonials,
  CTA,
  Footer
} from '@/components/landing-page';
import { getServerSession } from '@/lib/auth/auth-session';
import { redirect } from 'next/navigation';
import React from 'react';

const LandingPage = async () => {
  const session = await getServerSession();

  if (session?.user) {
    return redirect(
      `${session?.user.defaultWorkspace ? `/${session.user.defaultWorkspace}/overview` : '/onboarding/workspace'}`
    );
  }

  return (
    <main className='h-screen'>
      <Navbar />
      <div className='mt-20 h-[calc(100%-5rem)] overflow-x-hidden overflow-y-auto bg-white'>
        <Hero />
        <TrustedBy />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  );
};

export default LandingPage;
