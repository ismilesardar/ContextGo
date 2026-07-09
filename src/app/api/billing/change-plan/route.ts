import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withWorkspace } from '@/lib/auth/workspace';
import { applyPlanToOrganization } from '@/lib/billing/apply-plan-to-organization';
import { creem, getActiveCreemSubscription } from '@/lib/billing/creem-client';
import {
  isDowngradePlan,
  PLANS
} from '@/utils/constants/pricing/pricing-plans';

export const POST = withWorkspace(
  async ({ workspaceId, body, activeOrganization }) => {
    try {
      // `withWorkspace` lets `workspaceId` be overridden via a `?workspaceId=`
      // query param without re-validating that the caller actually belongs to
      // that org — its `requiredPermissions` check only verifies the
      // caller's role in their *own* active organization. Since this route
      // moves real money, explicitly refuse to act on any workspace other
      // than the caller's own active one.
      if (workspaceId !== activeOrganization?.id) {
        return NextResponse.json(
          { error: 'Forbidden', code: 'workspace_mismatch' },
          { status: 403 }
        );
      }

      const planName = body?.planName as string | undefined;
      const period = body?.period as 'monthly' | 'yearly' | undefined;

      if (!planName || !period) {
        return NextResponse.json(
          { error: 'planName and period are required' },
          { status: 400 }
        );
      }

      const targetPlan = PLANS.find(
        (p) => p.name.toLowerCase() === planName.toLowerCase()
      );
      if (!targetPlan) {
        return NextResponse.json(
          { error: `Unknown plan "${planName}"` },
          { status: 400 }
        );
      }

      const productId =
        period === 'yearly'
          ? targetPlan.price.ids?.[0]
          : targetPlan.price.ids?.[1];
      if (!productId) {
        return NextResponse.json(
          { error: `No product ID for plan "${planName}" (${period})` },
          { status: 400 }
        );
      }

      const org = await prisma.organization.findUnique({
        where: { id: workspaceId },
        select: { plan: true, creemId: true }
      });

      if (!org?.creemId) {
        return NextResponse.json(
          {
            error: 'No active subscription to modify',
            code: 'no_active_subscription'
          },
          { status: 409 }
        );
      }

      const activeSubscription = await getActiveCreemSubscription(org.creemId);

      if (!activeSubscription?.id) {
        return NextResponse.json(
          {
            error: 'No active subscription to modify',
            code: 'no_active_subscription'
          },
          { status: 409 }
        );
      }

      const downgrading = isDowngradePlan({
        currentPlan: org?.plan || 'free',
        newPlan: planName
      });

      // A subscription scheduled to cancel at period end moves to a
      // distinct `scheduled_cancel` status (not `active`). Changing its
      // plan implies the user wants to keep the subscription instead, so
      // explicitly resume it first — relying on `upgrade()` to do this
      // implicitly would be undocumented behavior.
      if (activeSubscription.status === 'scheduled_cancel') {
        await creem.subscriptions.resume(activeSubscription.id);
      }

      const updatedSubscription = await creem.subscriptions.upgrade(
        activeSubscription.id,
        {
          productId,
          updateBehavior: downgrading
            ? 'proration-charge'
            : 'proration-charge-immediately'
        }
      );

      // A mid-cycle plan change is not a billing-period renewal — the
      // existing period continues, so the resource-creation quota window
      // must not reset here. Resetting it would let a customer bypass their
      // quota for free by toggling plans back and forth; it should only
      // reset on a genuine renewal (Creem's `subscription.paid` webhook) or
      // a brand-new subscription (`subscription.active`).
      await applyPlanToOrganization({
        organizationId: workspaceId,
        planName: targetPlan.name,
        resetUsageWindow: false
      });

      // Only surface a "charged $X" figure for the immediate-charge (upgrade)
      // path — a downgrade's `proration-charge` behavior defers any credit to
      // the next invoice, so `lastTransaction` here would just be stale data
      // from before this call, not a new charge.
      const charge =
        !downgrading && updatedSubscription.lastTransaction
          ? {
              amount:
                updatedSubscription.lastTransaction.amountPaid ??
                updatedSubscription.lastTransaction.amount,
              currency: updatedSubscription.lastTransaction.currency,
              status: updatedSubscription.lastTransaction.status
            }
          : null;

      return NextResponse.json({ ok: true, plan: targetPlan.name, charge });
    } catch (error) {
      console.error('Failed to change plan:', error);
      return NextResponse.json(
        { error: 'Failed to change plan' },
        { status: 500 }
      );
    }
  },
  { requiredPermissions: ['billing.write'] }
);
