import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withWorkspace } from '@/lib/auth/workspace';
import { getActiveCreemSubscription } from '@/lib/billing/creem-client';
import {
  isDowngradePlan,
  PLANS
} from '@/utils/constants/pricing/pricing-plans';

export const POST = withWorkspace(
  async ({ workspaceId, body, activeOrganization }) => {
    try {
      // See change-plan/route.ts for why this guard exists: `withWorkspace`
      // doesn't re-validate org membership when `workspaceId` is overridden
      // via a query param, and this route exposes another org's live
      // subscription/pricing data.
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

      const targetPriceDollars = targetPlan.price[period];
      if (targetPriceDollars == null) {
        return NextResponse.json(
          { error: `No price for plan "${planName}" (${period})` },
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

      const currentProduct =
        typeof activeSubscription.product === 'object'
          ? activeSubscription.product
          : null;
      const currentPriceCents = currentProduct?.price ?? 0;
      const currency = currentProduct?.currency ?? 'USD';
      const targetPriceCents = Math.round(targetPriceDollars * 100);

      // Creem has no proration-preview endpoint, so this estimate replicates
      // its apparent linear time-based proration: the price difference
      // scaled by the fraction of the current billing period remaining.
      // The actual charge (computed server-side by Creem at commit time) may
      // differ slightly (e.g. tax), so this is presented as an estimate.
      const now = Date.now();
      const periodStart = activeSubscription.currentPeriodStartDate
        ? new Date(activeSubscription.currentPeriodStartDate).getTime()
        : now;
      const periodEnd = activeSubscription.currentPeriodEndDate
        ? new Date(activeSubscription.currentPeriodEndDate).getTime()
        : now;
      const totalDuration = Math.max(periodEnd - periodStart, 1);
      const remainingFraction = Math.min(
        Math.max((periodEnd - now) / totalDuration, 0),
        1
      );

      const estimatedAmountCents = Math.round(
        (targetPriceCents - currentPriceCents) * remainingFraction
      );

      const downgrading = isDowngradePlan({
        currentPlan: org.plan || 'free',
        newPlan: planName
      });

      const pendingCancellation =
        activeSubscription.status === 'scheduled_cancel';

      return NextResponse.json({
        currentPlanName: org.plan,
        targetPlanName: targetPlan.name,
        direction: downgrading ? 'downgrade' : 'upgrade',
        estimatedAmount: estimatedAmountCents,
        currency,
        periodEnd: activeSubscription.currentPeriodEndDate ?? null,
        pendingCancellation,
        cancelDate: pendingCancellation
          ? (activeSubscription.currentPeriodEndDate ?? null)
          : null
      });
    } catch (error) {
      console.error('Failed to preview plan change:', error);
      return NextResponse.json(
        { error: 'Failed to preview plan change' },
        { status: 500 }
      );
    }
  },
  { requiredPermissions: ['billing.write'] }
);
