'use client';

import { Button } from '@/components/ui/button';
import SimpleDateRangePicker from '@/components/ui/simple-date-range-picker';
import { Spinner } from '@/components/ui/spinner';
import { APP_NAME } from '@/config/url.config';
import { axios } from '@/lib/api-setting/axios.config';
import { clientAccessCheck } from '@/lib/client-access-check';
import { useWorkspaceStore } from '@/store';
import { subMonths } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const AuditLogs = () => {
  const [loading, setLoading] = useState(false);
  const { activeWorkspace, activeMember } = useWorkspaceStore((state) => state);
  const searchParams = useSearchParams();
  const start =
    searchParams.get('start') || subMonths(new Date(), 12).toISOString();
  const end = searchParams.get('end') || new Date().toISOString();

  const permissionsError = clientAccessCheck({
    action: 'workspaces.write',
    role: activeMember?.role ?? 'viewer'
  }).error;

  const exportAuditLogs = async () => {
    if (!activeWorkspace?.id) {
      return;
    }

    setLoading(true);

    const lid = toast.loading('Exporting audit logs...');

    try {
      const response = await axios.post(
        `/api/audit-logs/export?workspaceId=${activeWorkspace?.id}`,
        { start, end },
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'blob'
        }
      );

      // Support both axios designs: some callers return full response for blob
      // (we do that in the axios config) so `response.data` is the Blob.
      // Other cases may return the Blob directly.
      const maybeBlob =
        response && (response as any).data ? (response as any).data : response;

      if (!(maybeBlob instanceof Blob)) {
        // If we didn't get a Blob, try to extract a useful error message
        const text =
          maybeBlob && typeof maybeBlob.text === 'function'
            ? await maybeBlob.text()
            : typeof maybeBlob === 'string'
              ? maybeBlob
              : JSON.stringify(maybeBlob || {});

        toast.error(text || 'Unexpected response when exporting audit logs');
        return;
      }

      const blob = maybeBlob as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `${APP_NAME} Audit Logs Export - ${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Exported successfully');
    } catch (err: any) {
      console.log('err', err);
      // axios throws for non-2xx; capture server message when available.
      let msg = err?.message || 'Failed to export audit logs';

      const serverData = err?.response?.data;
      if (serverData) {
        try {
          if (serverData instanceof Blob) {
            const text = await serverData.text();
            try {
              const parsed = JSON.parse(text);
              msg = parsed?.message || text;
            } catch (e) {
              msg = text;
            }
          } else if (typeof serverData === 'string') {
            msg = serverData;
          } else {
            msg = JSON.stringify(serverData);
          }
        } catch (e) {
          // fallback
        }
      }

      toast.error(msg);
    } finally {
      setLoading(false);
      toast.dismiss(lid);
    }
  };

  return (
    <div className='bg-card mb-6 rounded-xl border border-neutral-200 dark:border-neutral-500'>
      <div className='relative flex flex-col gap-5 p-5'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-base font-medium text-neutral-900 dark:text-neutral-300'>
            Audit Logs
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            Workspace users activity history
          </p>
        </div>
        <div className='bg-card flex flex-col items-start justify-between space-y-4 rounded-xl border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 dark:border-neutral-500'>
          <SimpleDateRangePicker
            className='w-full sm:max-w-xs dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
            align='start'
            disabled={permissionsError ? true : false}
            defaultInterval='1y'
          />

          <Button
            variant='brand'
            className='w-full sm:w-auto'
            disabled={permissionsError ? true : false}
            onClick={() => exportAuditLogs()}
            // loading={loading}
          >
            {loading && <Spinner />} Export CSV
          </Button>
        </div>
      </div>

      <div className='flex flex-col items-start justify-between space-y-3 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 dark:border-neutral-500 dark:bg-neutral-800'>
        <span className='text-sm text-neutral-500 dark:text-neutral-400'>
          {permissionsError
            ? 'Audit logs are available on the workspace owner and moderators. Please contact your administrator if you think you should have access.'
            : 'Exported audit logs will include user activity history and other important events.'}
        </span>
      </div>
    </div>
  );
};
