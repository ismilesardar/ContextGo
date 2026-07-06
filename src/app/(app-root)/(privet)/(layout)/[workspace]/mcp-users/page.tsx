import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { McpIdentitiesView } from '@/features/mcp-identities/components/mcp-identities-view';

export const metadata: Metadata = {
  title: `MCP Users - ${APP_NAME}`
};

export default function McpUsersPage() {
  return <McpIdentitiesView />;
}
