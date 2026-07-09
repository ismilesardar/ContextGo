import prisma from '@/lib/prisma';

export async function applyPlanToOrganization({
  organizationId,
  planName,
  creemCustomerId,
  resetUsageWindow = true
}: {
  organizationId: string;
  planName: string;
  creemCustomerId?: string;
  resetUsageWindow?: boolean;
}) {
  const { PLANS } = await import('@/utils/constants/pricing/pricing-plans');
  const planTemplate = PLANS.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  );
  if (!planTemplate) {
    console.error(
      `applyPlanToOrganization: no PLANS entry matches planName "${planName}"`
    );
  }

  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setMonth(nextReset.getMonth() + 1);

  const result = await prisma.organization.updateMany({
    where: { id: organizationId },
    data: {
      plan: planName,
      ...(creemCustomerId ? { creemId: creemCustomerId } : {}),
      ...(resetUsageWindow
        ? { lastResetDate: now, nextResetDate: nextReset }
        : {}),
      subscriptionCanceledAt: null,
      subscriptionEndsAt: null,
      usersLimit: planTemplate?.limits.users ?? 0,
      mcpIdentitiesLimit: planTemplate?.limits.mcpIdentities ?? 1,
      mcpApiKeysLimit: planTemplate?.limits.mcpApiKeys ?? 3,
      projectsLimit: planTemplate?.limits.projects ?? 2,
      contextsLimit: planTemplate?.limits.contexts ?? 10,
      instructionsLimit: planTemplate?.limits.instructions ?? 10,
      skillsLimit: planTemplate?.limits.skills ?? 10,
      promptTemplatesLimit: planTemplate?.limits.promptTemplates ?? 10,
      checklistsLimit: planTemplate?.limits.checklists ?? 10,
      agentProfilesLimit: planTemplate?.limits.agentProfiles ?? 10,
      mcpRequestsLimit: planTemplate?.limits.mcpRequests ?? 5000
    }
  });

  if (result.count === 0) {
    console.error(
      `applyPlanToOrganization: no organization matched id "${organizationId}"`
    );
  }

  return result.count > 0;
}
