import AcceptInviteView from '@/features/workspace/components/accept-invite-view';

export default function Page({
  params,
  searchParams
}: PageProps<'/workspaces/invites/[id]'>) {
  return <AcceptInviteView params={params} searchParams={searchParams} />;
}
