import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { InviteInformation } from './invite/invite-information';
import BoxDesign from '@/components/layout/box-design';
import Link from 'next/link';

export default async function AcceptInviteView({
  params
}: PageProps<'/workspaces/invites/[id]'>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect('/auth/login');

  const { id } = await params;

  const invitation = await auth.api
    .getInvitation({
      headers: await headers(),
      query: { id }
    })
    .catch(() => redirect('/'));

  return (
    <BoxDesign boxSize={85} isFooter={false}>
      <div className='flex w-full items-center justify-center py-16'>
        <Card className='w-full border-none bg-transparent shadow-none md:w-125'>
          <CardHeader>
            <CardTitle className='text-center text-[24px] font-semibold'>
              Organization Invitation
            </CardTitle>
            <CardDescription className='text-center text-[16px] text-balance text-neutral-500 dark:text-neutral-400'>
              You have been invited to join the {invitation.organizationName}{' '}
              organization as a {invitation.role}.
            </CardDescription>
          </CardHeader>

          <CardContent className='mt-7'>
            <InviteInformation invitation={invitation} />
            <div className='mt-6 flex items-center justify-center gap-4'>
              <Link
                href='/'
                target='_blank'
                className='text-sm font-medium transition-colors hover:text-neutral-700 hover:underline dark:text-neutral-500 dark:hover:text-neutral-600'
              >
                Go to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </BoxDesign>
  );
}
