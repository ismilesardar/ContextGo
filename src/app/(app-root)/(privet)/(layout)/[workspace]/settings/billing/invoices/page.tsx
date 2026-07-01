import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { InvoicesView } from '@/features/billing/components/invoices/invoices-view';
import React from 'react';

export const metadata: Metadata = {
  title: `Invoices - ${APP_NAME}`
};

const page = () => {
  return <InvoicesView />;
};

export default page;
