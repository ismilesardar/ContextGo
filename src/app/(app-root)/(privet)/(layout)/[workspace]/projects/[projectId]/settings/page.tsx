import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ProjectSettingsView } from '@/features/projects/components/project-settings-view';

export const metadata: Metadata = {
  title: `Project Settings - ${APP_NAME}`
};

export default async function ProjectSettingsPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <ProjectSettingsView workspaceSlug={workspace} projectId={projectId} />
  );
}
