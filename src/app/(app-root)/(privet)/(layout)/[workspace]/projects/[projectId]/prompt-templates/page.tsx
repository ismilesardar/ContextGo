import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PromptTemplatesListView } from '@/features/prompt-templates/components/prompt-templates-list-view';

export const metadata: Metadata = {
  title: `Prompt Templates - ${APP_NAME}`
};

export default async function PromptTemplatesPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <PromptTemplatesListView workspaceSlug={workspace} projectId={projectId} />
  );
}
