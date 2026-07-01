'use client';

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function InviteInformation({
  invitation
}: {
  invitation: { id: string; organizationId: string };
}) {
  const router = useRouter();

  function acceptInvite() {
    return authClient.organization.acceptInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: async () => {
          await authClient.organization.setActive(
            {
              organizationId: invitation.organizationId
            },
            {
              onSuccess: (context) => {
                if (context.data.slug) {
                  // set workspace name in session storage
                  setActiveWorkspaceName(context.data.slug);
                  window.location.href = `/${context.data.slug}/overview`;
                }
              },
              onError: () => {
                router.push('/');
              }
            }
          );
        },
        onError: () => {
          toast.error('Failed to accept the invitation. Please try again.');
        }
      }
    );
  }
  function rejectInvite() {
    return authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id
      },
      { onSuccess: () => router.push('/') }
    );
  }

  return (
    <div className='flex gap-4'>
      <BetterAuthActionButton className='grow' action={acceptInvite}>
        Accept
      </BetterAuthActionButton>
      <BetterAuthActionButton
        className='grow'
        variant='destructive'
        action={rejectInvite}
      >
        Reject
      </BetterAuthActionButton>
    </div>
  );
}
