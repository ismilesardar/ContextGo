import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { LibraryView } from '@/features/library/components/library-view';

export const metadata: Metadata = {
  title: `Library - ${APP_NAME}`
};

export default async function LibraryPage({
  params
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;

  return <LibraryView workspaceSlug={workspace} />;
}
