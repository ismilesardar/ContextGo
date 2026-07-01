import React from 'react';
import { AuditLogs } from './security/audit-logs';

export const WorkspaceSecurityView = () => {
  return (
    <div className='flex w-full flex-col gap-y-10 pb-10'>
      <AuditLogs />
    </div>
  );
};
