'use client';

import { useEffect, useState } from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceStore } from '@/store';
import { PlanDetails } from '@/utils/constants/pricing/pricing-plans';

type Preview = {
  currentPlanName: string;
  targetPlanName: string;
  direction: 'upgrade' | 'downgrade';
  estimatedAmount: number;
  currency: string;
  pendingCancellation?: boolean;
  cancelDate?: string | null;
};

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(Math.abs(amountCents) / 100);
}

export function ChangePlanConfirmationModal({
  open,
  onOpenChange,
  plan,
  period
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanDetails;
  period: 'monthly' | 'yearly';
}) {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const refreshActiveWorkspace = useWorkspaceStore(
    (state) => state.refreshActiveWorkspace
  );

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    let cancelled = false;
    setLoadingPreview(true);
    setPreviewError(null);

    fetch('/api/billing/change-plan/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName: plan.name, period })
    })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setPreviewError(data?.error || 'Failed to estimate plan change');
          return;
        }
        setPreview(data);
      })
      .catch(() => {
        if (!cancelled) setPreviewError('Failed to estimate plan change');
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, plan.name, period]);

  const handleConfirm = async () => {
    if (!activeWorkspace) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/billing/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: plan.name, period })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || 'Failed to change plan');
        return;
      }

      await refreshActiveWorkspace({ id: activeWorkspace.id });

      if (data?.charge?.amount != null) {
        toast.success(
          `Switched to ${plan.name} — ${formatMoney(data.charge.amount, data.charge.currency || 'USD')} charged to your card on file`
        );
      } else if (preview?.direction === 'downgrade') {
        toast.success(
          `Switched to ${plan.name} — any credit will apply to your next invoice`
        );
      } else {
        toast.success(`Switched to ${plan.name}`);
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to change plan'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isDowngrade = preview?.direction === 'downgrade';
  const amountIsZero = preview && preview.estimatedAmount === 0;

  return (
    <CustomModal
      showModal={open}
      setShowModal={(value) =>
        onOpenChange(typeof value === 'function' ? value(open) : value)
      }
    >
      <div className='flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 px-4 py-4 pt-8 sm:px-5 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>
          {isDowngrade ? 'Confirm downgrade' : 'Confirm upgrade'}
        </h3>
        <p className='flex -translate-y-2 items-center gap-2 text-center text-sm text-neutral-500 dark:text-neutral-400'>
          {preview?.currentPlanName ?? '…'}
          <ArrowRight className='h-3.5 w-3.5' />
          <span className='font-medium text-neutral-800 dark:text-neutral-200'>
            {plan.name}
          </span>
        </p>
      </div>

      <div className='space-y-4 px-4 py-8 sm:px-5'>
        {loadingPreview && (
          <div className='flex items-center justify-center gap-2 py-4 text-sm text-neutral-500'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Estimating cost…
          </div>
        )}

        {previewError && (
          <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'>
            {previewError}
          </div>
        )}

        {preview?.pendingCancellation && !loadingPreview && (
          <div className='space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950'>
            <p className='font-medium text-amber-900 dark:text-amber-200'>
              Your subscription is scheduled to cancel
              {preview.cancelDate
                ? ` on ${new Date(preview.cancelDate).toLocaleDateString()}`
                : ''}
              .
            </p>
            <p className='text-amber-700 dark:text-amber-400'>
              Changing your plan now will resume it and normal billing will
              continue.
            </p>
          </div>
        )}

        {preview && !loadingPreview && (
          <div className='space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-900'>
            {isDowngrade ? (
              <>
                <p className='font-medium text-neutral-900 dark:text-neutral-100'>
                  {amountIsZero
                    ? 'No immediate charge.'
                    : `Estimated credit: ${formatMoney(preview.estimatedAmount, preview.currency)}`}
                </p>
                <p className='text-neutral-500 dark:text-neutral-400'>
                  Any unused balance from your current plan will be applied to
                  your next invoice — you won&apos;t be charged today.
                </p>
              </>
            ) : (
              <>
                <p className='font-medium text-neutral-900 dark:text-neutral-100'>
                  Estimated charge:{' '}
                  {formatMoney(preview.estimatedAmount, preview.currency)}
                </p>
                <p className='text-neutral-500 dark:text-neutral-400'>
                  This prorated amount will be charged to your card on file
                  immediately. The final amount may differ slightly (e.g. tax).
                </p>
              </>
            )}
          </div>
        )}

        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleConfirm}
            disabled={submitting || loadingPreview || !!previewError}
            className='gap-2'
          >
            {submitting && <Loader2 className='h-4 w-4 animate-spin' />}
            {preview?.pendingCancellation
              ? 'Resume & switch plan'
              : isDowngrade
                ? 'Confirm downgrade'
                : 'Confirm & pay'}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
