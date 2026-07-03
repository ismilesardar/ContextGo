import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ProjectsArchivedView } from '@/features/projects/components/projects-archived-view';

export const metadata: Metadata = {
  title: `Archived Projects - ${APP_NAME}`
};

export default function ProjectsArchivedPage() {
  return <ProjectsArchivedView />;
}
