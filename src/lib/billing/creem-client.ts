import { Creem } from 'creem';

export const creem = new Creem({
  apiKey: process.env.CREEM_API_KEY ?? '',
  // Match the BetterAuth plugin's testMode: true
  serverIdx: 1
});

/**
 * Finds the Creem subscription actually in effect for a customer.
 *
 * The local `creem_subscription` table can carry stale/duplicate rows for
 * the same Creem subscription id (webhook events are persisted as-received,
 * not upserted), so its `status` column can't be trusted. This asks Creem
 * directly for live subscription state instead. A customer can also end up
 * with more than one concurrently "active" subscription (e.g. a pre-fix bug
 * that opened a fresh checkout on every upgrade instead of modifying the
 * existing one) — in that case the most recently created active
 * subscription is treated as the one actually in effect.
 *
 * `scheduled_cancel` subscriptions are included too (a subscription that's
 * scheduled to cancel at period end moves to this distinct status — it
 * doesn't stay `active`), so callers must check `.status` and, if it's
 * `scheduled_cancel`, resume it (`creem.subscriptions.resume`) before any
 * further modification.
 */
export async function getActiveCreemSubscription(creemCustomerId: string) {
  const subscriptionsRes =
    await creem.customers.listSubscriptions(creemCustomerId);
  const liveSubscriptions = Array.isArray(subscriptionsRes?.items)
    ? subscriptionsRes.items
    : [];

  return (
    liveSubscriptions
      .filter(
        (s: any) => s.status === 'active' || s.status === 'scheduled_cancel'
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0] ?? null
  );
}
