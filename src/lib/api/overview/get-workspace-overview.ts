import prisma from '@/lib/prisma';
import { isOrgAdmin } from '@/lib/permissions/project-access';

const TREND_DAYS = 14;

export interface WorkspaceOverviewCounts {
  projects: number;
  contexts: number;
  instructions: number;
  skills: number;
  promptTemplates: number;
  checklists: number;
  agentProfiles: number;
  mcpUsers: number;
  libraryTemplates: number;
}

export interface ResourceBreakdownItem {
  type: string;
  label: string;
  count: number;
}

export interface ActivityTrendPoint {
  date: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  resourceType: string | null;
  resourceTitle: string | null;
  actorName: string;
  createdAt: string;
  projectId: string;
  projectName: string;
}

export interface WorkspaceOverview {
  counts: WorkspaceOverviewCounts;
  resourceBreakdown: ResourceBreakdownItem[];
  activityTrend: ActivityTrendPoint[];
  recentActivity: RecentActivityItem[];
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getWorkspaceOverview(
  userId: string,
  workspaceId: string
): Promise<WorkspaceOverview> {
  const isAdmin = await isOrgAdmin(userId, workspaceId);

  const visibleProjects = await prisma.project.findMany({
    where: {
      organizationId: workspaceId,
      status: 'active',
      deletedAt: null,
      ...(isAdmin ? {} : { members: { some: { userId } } })
    },
    select: { id: true }
  });
  const projectIds = visibleProjects.map((p) => p.id);
  const projectWhere = { projectId: { in: projectIds } };

  const [
    contexts,
    instructions,
    skills,
    promptTemplates,
    checklists,
    agentProfiles,
    mcpUsers,
    libraryTemplates
  ] = await Promise.all([
    prisma.context.count({ where: projectWhere }),
    prisma.instruction.count({ where: projectWhere }),
    prisma.skill.count({ where: projectWhere }),
    prisma.promptTemplate.count({ where: projectWhere }),
    prisma.checklist.count({ where: projectWhere }),
    prisma.agentProfile.count({ where: projectWhere }),
    prisma.mcpIdentity.count({ where: { organizationId: workspaceId } }),
    prisma.libraryTemplate.count()
  ]);

  const counts: WorkspaceOverviewCounts = {
    projects: projectIds.length,
    contexts,
    instructions,
    skills,
    promptTemplates,
    checklists,
    agentProfiles,
    mcpUsers,
    libraryTemplates
  };

  const resourceBreakdown: ResourceBreakdownItem[] = [
    { type: 'context', label: 'Contexts', count: contexts },
    { type: 'instruction', label: 'Instructions', count: instructions },
    { type: 'skill', label: 'Skills', count: skills },
    {
      type: 'prompt_template',
      label: 'Prompt Templates',
      count: promptTemplates
    },
    { type: 'checklist', label: 'Checklists', count: checklists },
    { type: 'agent_profile', label: 'Agent Profiles', count: agentProfiles }
  ];

  let recentActivity: RecentActivityItem[] = [];
  const activityTrend: ActivityTrendPoint[] = [];

  if (projectIds.length > 0) {
    const trendStart = new Date();
    trendStart.setDate(trendStart.getDate() - (TREND_DAYS - 1));
    trendStart.setHours(0, 0, 0, 0);

    const [recentRows, trendRows] = await Promise.all([
      prisma.projectActivity.findMany({
        where: projectWhere,
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { project: { select: { id: true, name: true } } }
      }),
      prisma.projectActivity.findMany({
        where: { ...projectWhere, createdAt: { gte: trendStart } },
        select: { createdAt: true }
      })
    ]);

    recentActivity = recentRows.map((row) => ({
      id: row.id,
      action: row.action,
      resourceType: row.resourceType,
      resourceTitle: row.resourceTitle,
      actorName: row.actorName,
      createdAt: row.createdAt.toISOString(),
      projectId: row.project.id,
      projectName: row.project.name
    }));

    const bucket = new Map<string, number>();
    for (let i = 0; i < TREND_DAYS; i++) {
      const d = new Date(trendStart);
      d.setDate(d.getDate() + i);
      bucket.set(dayKey(d), 0);
    }
    for (const row of trendRows) {
      const key = dayKey(row.createdAt);
      bucket.set(key, (bucket.get(key) ?? 0) + 1);
    }
    for (const [date, count] of bucket) {
      activityTrend.push({ date, count });
    }
  }

  return { counts, resourceBreakdown, activityTrend, recentActivity };
}
