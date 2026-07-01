'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { CustomPopover } from '../custom-popover';
import { Button } from '../button';
import { Icon, Icons } from '@/components/icons';
import { Spinner } from '../spinner';
import { DynamicTooltipWrapper } from '../tooltip';
import { cn } from '@/lib/utils';
import { clientAccessCheck } from '@/lib/client-access-check';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card';
import { Markdown } from '@/components/share/markdown';
import { useWorkspaceStore } from '@/store';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { PlanDetails } from '@/utils/constants/pricing/pricing-plans';

export default function SubscriptionMenu({
  activeSubscription
}: {
  activeSubscription: (PlanDetails & { plan: string }) | null;
}) {
  // const { id: workspaceId, role, plan, defaultProgramId } = useWorkspace();
  const activeMember = useWorkspaceStore((state) => state.activeMember);
  const { id: workspaceId, creemId } =
    useWorkspaceStore((state) => state.activeWorkspace) || {};
  const router = useRouter();
  // const { hasPermission } = usePermissions();

  // Workspace permission
  // const canBillingRead = hasPermission('billing', '');

  const permissionsError = clientAccessCheck({
    action: 'billing.write',
    role: activeMember?.role ?? 'viewer'
  }).error;

  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showPlanChangeConfirmationModal, setShowPlanChangeConfirmationModal] =
    useState(false);

  const openBillingPortal = async () => {
    setIsOpen(false);
    setClicked(true);

    if (!creemId) {
      setClicked(false);
      toast.error('No active organization');
      return;
    }

    const { data, error } = await authClient.creem.createPortal({
      customerId: creemId
    });

    if (error) {
      toast.error(error.message || 'Failed to open billing portal');
      setClicked(false);
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    }

    setClicked(false);
  };

  // Check if canceling would lose partner access
  // const losesPartnerAccess =
  //   plan &&
  //   defaultProgramId &&
  //   wouldLosePartnerAccess({ currentPlan: plan, newPlan: null });

  // const { setShowPlanChangeConfirmationModal, PlanChangeConfirmationModal } =
  //   usePlanChangeConfirmationModal({
  //     onConfirm: () => openBillingPortal(true),
  //   });

  const handleCancelSubscription = async () => {
    setIsOpen(false);
    setClicked(true);

    if (!activeSubscription) {
      setClicked(false);
      return toast.error('No active subscription');
    }

    const { data, error } = await authClient.creem.cancelSubscription();

    if (error) {
      setClicked(false);
      toast.error(error.message || 'Failed to cancel subscription');
      return;
    }

    if (data?.success) {
      toast.success(data.message || 'Subscription canceled successfully');
    }

    setClicked(false);
  };

  return (
    <>
      <PlanChangeConfirmationModal
        showPlanChangeConfirmationModal={showPlanChangeConfirmationModal}
        setShowPlanChangeConfirmationModal={setShowPlanChangeConfirmationModal}
        onConfirm={() => {
          openBillingPortal();
        }}
      />
      <CustomPopover
        openPopover={isOpen}
        setOpenPopover={setIsOpen}
        content={
          <Command tabIndex={0} loop className='pointer-events-auto'>
            <Command.List className='flex w-screen flex-col gap-1 rounded-md bg-white p-1.5 text-sm focus-visible:outline-none sm:w-auto sm:min-w-45 dark:bg-neutral-800'>
              <MenuItem
                icon={Icons.reportMoney}
                label='Open billing portal'
                onSelect={() => openBillingPortal()}
                disabledTooltip={permissionsError}
              />
              <MenuItem
                icon={Icons.clipboardX}
                label='Cancel subscription'
                onSelect={handleCancelSubscription}
                disabledTooltip={permissionsError}
              />
            </Command.List>
          </Command>
        }
        align='end'
      >
        <Button
          type='button'
          className='dark:hover:bg-neutral-500/30` h-9 px-2 dark:bg-neutral-500/50'
          variant='secondary'
          disabled={clicked}
        >
          {clicked ? (
            <Spinner className='size-4 shrink-0' />
          ) : (
            <Icons.dots className='size-4 shrink-0' />
          )}
        </Button>
      </CustomPopover>
    </>
  );
}

function MenuItem({
  icon: IconComp,
  label,
  onSelect,
  disabledTooltip
}: {
  icon: Icon;
  label: string;
  onSelect: () => void;
  disabledTooltip?: string | boolean;
}) {
  return (
    <DynamicTooltipWrapper
      tooltipProps={disabledTooltip ? { content: disabledTooltip } : undefined}
    >
      <Command.Item
        className={cn(
          'group flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm whitespace-nowrap text-neutral-600 select-none dark:text-neutral-400',
          'data-[selected=true]:bg-neutral-100 data-[selected=true]:dark:text-neutral-500',
          disabledTooltip && 'cursor-not-allowed opacity-50'
        )}
        onSelect={disabledTooltip ? undefined : onSelect}
      >
        <IconComp
          className={cn(
            'size-4 shrink-0 text-neutral-700 dark:text-neutral-500',
            'group-data-[selected=true]:text-neutral-900'
          )}
        />
        {label}
      </Command.Item>
    </DynamicTooltipWrapper>
  );
}

function PlanChangeConfirmationModal({
  showPlanChangeConfirmationModal,
  setShowPlanChangeConfirmationModal,
  onConfirm
}: {
  showPlanChangeConfirmationModal: boolean;
  setShowPlanChangeConfirmationModal: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void | Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <Dialog
      open={showPlanChangeConfirmationModal}
      onOpenChange={(c) => {
        setShowPlanChangeConfirmationModal(c);
        // onOpen(c);
      }}
    >
      {/* <DialogTrigger asChild>
        <Button
          variant='secondary'
          className='mt-1 flex w-full cursor-pointer items-center justify-start gap-x-2.5 rounded-md p-2 text-neutral-700 transition-all duration-75 hover:bg-neutral-200/10 dark:text-neutral-300'
        >
          <Icons.add />
          <span className='block truncate'>Create workspace</span>
        </Button>
      </DialogTrigger> */}
      <DialogContent className='p-0'>
        <Card className='w-full border-none bg-transparent shadow-none'>
          <CardHeader className='flex flex-col items-center justify-center space-y-1 border-b border-neutral-200 px-4 py-2 sm:px-16 dark:border-neutral-600'>
            <CardTitle className='border-b border-neutral-200 px-4 py-3 sm:px-6 sm:py-4'>
              <h3 className='text-lg font-medium'>Plan change confirmation</h3>
            </CardTitle>
            <CardDescription className='text-center text-[14px] text-balance text-neutral-500 dark:text-neutral-400'>
              <div className='flex flex-col items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4'>
                <Icons.warning className='size-5 text-amber-600' />
                <p className='text-sm font-medium text-amber-900'>
                  This change will affect your partner program
                </p>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className='flex flex-col gap-4 bg-neutral-50 p-4 sm:p-6'>
            <Markdown className='list-decimal'>
              {[
                '- You will lose access to your partner program.',
                '- Your partner program will be deactivated and partners will be notified automatically.',
                '- Partner links will stop tracking new activity.',
                `- Any [pending payouts](/{slug}/program/payouts?status=pending) must be communicated and settled directly with your partners.`
              ].join('\n')}
            </Markdown>

            <div className='flex items-center justify-end gap-2 border-t border-neutral-200 px-4 py-5 sm:px-6'>
              <Button
                variant='secondary'
                className='h-8 w-fit px-3'
                onClick={() => setShowPlanChangeConfirmationModal(false)}
              >
                Cancel
              </Button>

              <Button
                variant='brand'
                className='h-8 w-fit px-3'
                disabled={isSubmitting}
                onClick={async () => {
                  if (isSubmitting) return;
                  setIsSubmitting(true);
                  await onConfirm();
                  setIsSubmitting(false);
                }}
              >
                {isSubmitting && <Spinner />}
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
