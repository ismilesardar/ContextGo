import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ProjectsListView } from '@/features/projects/components/projects-list-view';

export const metadata: Metadata = {
  title: `Projects - ${APP_NAME}`
};

export default function ProjectsPage() {
  return <ProjectsListView />;
}
