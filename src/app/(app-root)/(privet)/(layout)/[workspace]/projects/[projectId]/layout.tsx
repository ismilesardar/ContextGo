import { ProjectWorkspaceShell } from '@/features/projects/components/project-workspace-shell';

export default function ProjectWorkspaceLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ProjectWorkspaceShell>{children}</ProjectWorkspaceShell>;
}
