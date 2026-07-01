'use client';

import { useQuery } from '@tanstack/react-query';
import type { Invoice } from '@/app/api/billing/invoices/route';

interface InvoicesResponse {
  invoices: Invoice[];
}

export function useInvoices(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['billing-invoices', workspaceId],
    queryFn: async (): Promise<Invoice[]> => {
      const res = await fetch('/api/billing/invoices', {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = (await res.json()) as InvoicesResponse;
      return data.invoices || [];
    },
    enabled: !!workspaceId,
    staleTime: 60_000
  });
}
