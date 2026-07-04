import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { InstructionsListView } from '@/features/instructions/components/instructions-list-view';

export const metadata: Metadata = {
  title: `Instructions - ${APP_NAME}`
};

export default async function InstructionsPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <InstructionsListView workspaceSlug={workspace} projectId={projectId} />
  );
}
