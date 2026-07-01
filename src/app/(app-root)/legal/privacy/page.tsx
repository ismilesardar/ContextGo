import BoxDesign from '@/components/layout/box-design';
import { APP_NAME } from '@/config/url.config';
import { PrivacyView } from '@/features/legal/privacy/privacy-view';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `Privacy Policy – ${APP_NAME}`,
  description: `Learn how ${APP_NAME} collects, uses, and protects your personal data. Our privacy policy covers data collection, sharing, security, and your rights.`
};

export default async function Page() {
  return (
    <BoxDesign boxSize={40} isFooter={false}>
      <PrivacyView />
    </BoxDesign>
  );
}
