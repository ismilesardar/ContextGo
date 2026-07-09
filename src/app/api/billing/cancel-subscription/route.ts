import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withWorkspace } from '@/lib/auth/workspace';
import { creem, getActiveCreemSubscription } from '@/lib/billing/creem-client';

export const POST = withWorkspace(
  async ({ workspaceId, activeOrganization }) => {
    try {
      // See change-plan/route.ts for why this guard exists: `withWorkspace`
      // doesn't re-validate org membership when `workspaceId` is overridden
      // via a query param.
      if (workspaceId !== activeOrganization?.id) {
        return NextResponse.json(
          { error: 'Forbidden', code: 'workspace_mismatch' },
          { status: 403 }
        );
      }

      const org = await prisma.organization.findUnique({
        where: { id: workspaceId },
        select: { creemId: true }
      });

      if (!org?.creemId) {
        return NextResponse.json(
          {
            error: 'No active subscription to cancel',
            code: 'no_active_subscription'
          },
          { status: 409 }
        );
      }

      // The better-auth Creem plugin's own `/creem/cancel-subscription`
      // endpoint resolves which subscription to cancel by querying its
      // local `creem_subscription` table (keyed by the session user id, not
      // this org), which — like the app's own tables — can carry
      // stale/duplicate rows (webhook events are persisted as-received, not
      // upserted). That's what caused a "Subscription cannot be canceled in
      // state: canceled" error: it picked an already-canceled stale row
      // instead of the real current one. Bypass that endpoint entirely and
      // resolve the subscription from live Creem data instead, same as the
      // other billing routes.
      const activeSubscription = await getActiveCreemSubscription(org.creemId);

      if (!activeSubscription?.id) {
        return NextResponse.json(
          {
            error: 'No active subscription to cancel',
            code: 'no_active_subscription'
          },
          { status: 409 }
        );
      }

      if (activeSubscription.status === 'scheduled_cancel') {
        return NextResponse.json(
          {
            error: 'This subscription is already scheduled to cancel',
            code: 'already_canceled'
          },
          { status: 409 }
        );
      }

      const canceled = await creem.subscriptions.cancel(
        activeSubscription.id,
        {}
      );

      await prisma.organization.updateMany({
        where: { id: workspaceId },
        data: {
          subscriptionCanceledAt: new Date(),
          subscriptionEndsAt: canceled.currentPeriodEndDate
            ? new Date(canceled.currentPeriodEndDate)
            : null
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Subscription canceled successfully'
      });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }
  },
  { requiredPermissions: ['billing.write'] }
);
