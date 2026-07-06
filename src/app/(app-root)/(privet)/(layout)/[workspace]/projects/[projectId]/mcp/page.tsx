import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { McpView } from '@/features/mcp/components/mcp-view';

export const metadata: Metadata = {
  title: `MCP - ${APP_NAME}`
};

export default async function McpPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return <McpView workspaceSlug={workspace} projectId={projectId} />;
}
