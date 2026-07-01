import PageContainer from '@/components/layout/page-container';
import React from 'react';

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return <PageContainer>{children}</PageContainer>;
};

export default WorkspaceLayout;
