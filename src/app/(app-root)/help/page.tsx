import { APP_NAME } from '@/config/url.config';
import { HelpIndexView } from '@/features/help/components/help-index-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Documentation – ${APP_NAME}`,
  description: `Learn how to use ${APP_NAME}: organizations, projects, Contexts, Instructions, Skills, Prompt Templates, Checklists, Agent Profiles, the Library, and connecting AI tools via MCP.`
};

export default function Page() {
  return <HelpIndexView />;
}
