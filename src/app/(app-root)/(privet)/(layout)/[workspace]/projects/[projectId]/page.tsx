import { redirect } from 'next/navigation';

export default async function ProjectWorkspaceIndexPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;
  redirect(`/${workspace}/projects/${projectId}/contexts`);
}
