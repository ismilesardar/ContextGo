import PageContainer from '@/components/layout/page-container';
import React from 'react';

const SystemAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <PageContainer>{children}</PageContainer>;
};

export default SystemAdminLayout;
