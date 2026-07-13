import {
  Navbar,
  Hero,
  TrustedBy,
  WorksWithAI,
  FeatureGrid,
  HowItWorks,
  UseCases,
  FAQ,
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
      <div className='bg-background mt-20 h-[calc(100%-5rem)] overflow-x-hidden overflow-y-auto'>
        <Hero />
        <WorksWithAI />
        <FeatureGrid />
        <TrustedBy />
        <HowItWorks />
        <UseCases />
        <CTA />
        <FAQ />
        <Footer />
      </div>
    </main>
  );
};

export default LandingPage;
