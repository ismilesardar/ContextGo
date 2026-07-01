import cron from 'node-cron';
import prisma from '../prisma';

export function userMonthlyPlanResetCron() {
  // Use globalThis to prevent duplicate registration during Hot Module Replacement (HMR)
  if ((globalThis as any)._isCronStarted) {
    return;
  }

  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Find orgs where lastResetDate is 30+ days ago
      const orgs = await prisma.organization.findMany({
        where: {
          lastResetDate: {
            lte: thirtyDaysAgo
          }
        },
        select: { id: true }
      });

      if (orgs.length === 0) return;

      // Find which of these orgs have an active monthly subscription
      const activeSubs = await prisma.creem_subscription.findMany({
        where: {
          referenceId: { in: orgs.map((o) => o.id) },
          status: { in: ['active', 'trialing'] }
        },
        select: {
          referenceId: true,
          periodStart: true,
          periodEnd: true
        }
      });

      // Skip monthly subscribers (period ≈ 30 days) — onSubscriptionPaid handles them
      const monthlySubOrgIds = new Set(
        activeSubs
          .filter((sub) => {
            if (!sub.periodStart || !sub.periodEnd) return false;
            const diffDays =
              (sub.periodEnd.getTime() - sub.periodStart.getTime()) /
              (1000 * 60 * 60 * 24);
            return diffDays <= 45;
          })
          .map((sub) => sub.referenceId)
      );

      const orgsToReset = orgs.filter((o) => !monthlySubOrgIds.has(o.id));

      if (orgsToReset.length === 0) return;

      const now = new Date();
      const nextReset = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await prisma.organization.updateMany({
        where: {
          id: { in: orgsToReset.map((o) => o.id) }
        },
        data: {
          systemTokenUsage: 0,
          imageTokenUsage: 0,
          lastResetDate: now,
          nextResetDate: nextReset
        }
      });
    } catch (error) {
      console.error('❌ [CRON] Monthly reset failed:', error);
    }
  });

  (globalThis as any)._isCronStarted = true;
}
