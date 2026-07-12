import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FeedbackRow } from './feedback-row';

export async function FeedbackPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect('/auth/login');

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { user: ['list'] } }
  });
  if (!hasAccess.success) return redirect('/');

  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className='container mx-auto my-6 px-4'>
      <Link
        href='/'
        className='mb-6 inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900'
      >
        <Icons.chevronLeft className='mr-1 size-4' />
        Back to Home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Icons.feedback className='h-5 w-5' />
            Feedback ({feedback.length})
          </CardTitle>
          <CardDescription>
            Feedback submitted by users from within the app
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <Icons.feedback className='mb-3 h-12 w-12 text-neutral-300' />
              <p className='text-sm text-neutral-500'>No feedback yet.</p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='w-20'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((item) => (
                    <FeedbackRow key={item.id} feedback={item as any} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
