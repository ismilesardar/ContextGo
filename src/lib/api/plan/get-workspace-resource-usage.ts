import prisma from '@/lib/prisma';

export interface ResourceUsageItem {
  key: string;
  label: string;
  used: number;
  limit: number;
}

export async function getWorkspaceResourceUsage(
  workspaceId: string
): Promise<ResourceUsageItem[]> {
  const organization = await prisma.organization.findUnique({
    where: { id: workspaceId },
    select: {
      lastResetDate: true,
      mcpIdentitiesLimit: true,
      projectsLimit: true,
      contextsLimit: true,
      instructionsLimit: true,
      skillsLimit: true,
      promptTemplatesLimit: true,
      checklistsLimit: true,
      agentProfilesLimit: true,
      mcpRequestsLimit: true
    }
  });

  const periodStart = organization?.lastResetDate ?? new Date(0);

  const projectIds = (
    await prisma.project.findMany({
      where: { organizationId: workspaceId, deletedAt: null },
      select: { id: true }
    })
  ).map((p) => p.id);
  const projectWhere = { projectId: { in: projectIds } };

  const [
    projects,
    contexts,
    instructions,
    skills,
    promptTemplates,
    checklists,
    agentProfiles,
    mcpIdentities,
    mcpRequests,
    mcpResponses
  ] = await Promise.all([
    prisma.project.count({
      where: {
        organizationId: workspaceId,
        deletedAt: null,
        createdAt: { gte: periodStart }
      }
    }),
    prisma.context.count({
      where: { ...projectWhere, createdAt: { gte: periodStart } }
    }),
    prisma.instruction.count({
      where: { ...projectWhere, createdAt: { gte: periodStart } }
    }),
    prisma.skill.count({
      where: { ...projectWhere, createdAt: { gte: periodStart } }
    }),
    prisma.promptTemplate.count({
      where: { ...projectWhere, createdAt: { gte: periodStart } }
    }),
    prisma.checklist.count({
      where: { ...projectWhere, createdAt: { gte: periodStart } }
    }),
    prisma.agentProfile.count({
      where: { ...projectWhere, createdAt: { gte: periodStart } }
    }),
    prisma.mcpIdentity.count({
      where: {
        organizationId: workspaceId,
        createdAt: { gte: periodStart }
      }
    }),
    prisma.mcpRequestLog.count({
      where: { organizationId: workspaceId, receivedAt: { gte: periodStart } }
    }),
    prisma.mcpRequestLog.count({
      where: {
        organizationId: workspaceId,
        receivedAt: { gte: periodStart },
        respondedAt: { not: null }
      }
    })
  ]);

  return [
    {
      key: 'projects',
      label: 'Projects',
      used: projects,
      limit: organization?.projectsLimit ?? 0
    },
    {
      key: 'contexts',
      label: 'Contexts',
      used: contexts,
      limit: organization?.contextsLimit ?? 0
    },
    {
      key: 'instructions',
      label: 'Instructions',
      used: instructions,
      limit: organization?.instructionsLimit ?? 0
    },
    {
      key: 'skills',
      label: 'Skills',
      used: skills,
      limit: organization?.skillsLimit ?? 0
    },
    {
      key: 'promptTemplates',
      label: 'Prompt Templates',
      used: promptTemplates,
      limit: organization?.promptTemplatesLimit ?? 0
    },
    {
      key: 'checklists',
      label: 'Checklists',
      used: checklists,
      limit: organization?.checklistsLimit ?? 0
    },
    {
      key: 'agentProfiles',
      label: 'Agent Profiles',
      used: agentProfiles,
      limit: organization?.agentProfilesLimit ?? 0
    },
    {
      key: 'mcpIdentities',
      label: 'MCP Users',
      used: mcpIdentities,
      limit: organization?.mcpIdentitiesLimit ?? 0
    },
    {
      key: 'mcpRequests',
      label: 'MCP Requests',
      used: mcpRequests + mcpResponses,
      limit: organization?.mcpRequestsLimit ?? 0
    }
  ];
}
