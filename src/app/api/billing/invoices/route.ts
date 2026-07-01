import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withWorkspace } from '@/lib/auth/workspace';
import { Creem } from 'creem';

const creem = new Creem({
  apiKey: process.env.CREEM_API_KEY ?? '',
  // Match the BetterAuth plugin's testMode: true
  serverIdx: 1
});

export interface SubscriptionInvoice {
  type: 'subscription';
  id: string;
  productId: string;
  status: string;
  periodStart: string | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  amount: number | null;
  currency: string;
  createdAt: string;
}

export interface OrderInvoice {
  type: 'order';
  id: string;
  productId: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface TopUpInvoice {
  type: 'topup';
  id: string;
  amount: number;
  tokens: number;
  tokenType: string;
  status: string;
  createdAt: string;
}

export type Invoice = SubscriptionInvoice | OrderInvoice | TopUpInvoice;

export const GET = withWorkspace(async ({ workspaceId }) => {
  try {
    // ── Fetch workspace-scoped records from local DB (source of truth) ──

    const [org, subscriptions, topUps] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: workspaceId },
        select: { creemId: true }
      }),
      prisma.creem_subscription.findMany({
        where: { referenceId: workspaceId },
        orderBy: { periodStart: 'desc' }
      }),
      prisma.topUpPurchase.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const topUpInvoices: TopUpInvoice[] = topUps.map((purchase) => ({
      type: 'topup' as const,
      id: purchase.id,
      amount: purchase.amount,
      tokens: purchase.tokens,
      tokenType: purchase.tokenType,
      status: purchase.status,
      createdAt: purchase.createdAt.toISOString()
    }));

    // Subscription invoices — from local DB, enriched by Creem API
    let subscriptionInvoices: SubscriptionInvoice[] = subscriptions.map(
      (sub) => ({
        type: 'subscription' as const,
        id: sub.id,
        productId: sub.productId,
        status: sub.status,
        periodStart: sub.periodStart?.toISOString() ?? null,
        periodEnd: sub.periodEnd?.toISOString() ?? null,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
        amount: null,
        currency: 'USD',
        createdAt: sub.periodStart?.toISOString() ?? ''
      })
    );

    // Enrich with amounts from Creem API (only for verified subscription IDs)
    if (org?.creemId && subscriptionInvoices.length > 0) {
      try {
        const subscriptionsRes = await creem.customers.listSubscriptions(
          org.creemId
        );

        const creemSubs = Array.isArray(subscriptionsRes?.items)
          ? subscriptionsRes.items
          : [];

        // Build a lookup by Creem subscription ID
        const creemSubMap = new Map(creemSubs.map((s: any) => [s.id, s]));

        subscriptionInvoices = subscriptionInvoices.map((inv) => {
          const creemSub = creemSubMap.get(inv.id);
          if (!creemSub) return inv;
          return {
            ...inv,
            status: creemSub.status ?? inv.status,
            amount: creemSub.lastTransaction?.amount ?? inv.amount,
            currency: creemSub.lastTransaction?.currency ?? 'USD',
            periodStart: creemSub.currentPeriodStartDate ?? inv.periodStart,
            periodEnd: creemSub.currentPeriodEndDate ?? inv.periodEnd,
            cancelAtPeriodEnd:
              creemSub.cancelAtPeriodEnd ?? inv.cancelAtPeriodEnd
          };
        });
      } catch (err) {
        console.error('Failed to enrich subscriptions from Creem:', err);
      }
    }

    // Orders from Creem — only include if the customer's metadata matches this org
    let orderInvoices: OrderInvoice[] = [];

    if (org?.creemId) {
      try {
        const ordersRes = await creem.customers
          .getOrders(org.creemId)
          .catch((err) => {
            console.error('Failed to fetch orders from Creem:', err);
            return null;
          });

        if (ordersRes) {
          const orders = Array.isArray(ordersRes?.items) ? ordersRes.items : [];
          orderInvoices = orders.map((order: any) => ({
            type: 'order' as const,
            id: order.id ?? '',
            productId: order.product ?? '',
            status: order.status ?? 'unknown',
            amount: order.amount ?? 0,
            currency: order.currency ?? 'USD',
            createdAt: order.createdAt ?? ''
          }));
        }
      } catch (err) {
        console.error('Failed to fetch orders from Creem:', err);
      }
    }

    // Combine and sort by date (newest first)
    const all: Invoice[] = [
      ...subscriptionInvoices,
      ...orderInvoices,
      ...topUpInvoices
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ invoices: all });
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
});
