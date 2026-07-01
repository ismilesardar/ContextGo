import BoxDesign from '@/components/layout/box-design';
import { APP_NAME } from '@/config/url.config';
import { TermsView } from '@/features/legal/terms/terms-view';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `Terms of Service – ${APP_NAME}`,
  description: `Read the Terms of Service for ${APP_NAME}. Learn about account registration, subscriptions, acceptable use, intellectual property, and more.`
};

export default async function Page() {
  return (
    <BoxDesign boxSize={40} isFooter={false}>
      <TermsView />
    </BoxDesign>
  );
}
