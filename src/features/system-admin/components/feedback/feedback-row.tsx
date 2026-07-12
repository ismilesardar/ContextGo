'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Eye, Trash2, MailOpen, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

export function FeedbackRow({ feedback }: { feedback: Feedback }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleRead = async () => {
    try {
      const res = await fetch(`/api/feedback/${feedback.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !feedback.isRead })
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success(feedback.isRead ? 'Marked as unread' : 'Marked as read');
      router.refresh();
    } catch {
      toast.error('Failed to update feedback');
    }
  };

  const deleteFeedback = async () => {
    try {
      const res = await fetch(`/api/feedback/${feedback.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Feedback deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete feedback');
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(feedback.createdAt));

  return (
    <>
      <TableRow className={!feedback.isRead ? 'bg-emerald-500/40' : ''}>
        <TableCell className='font-medium'>{feedback.user.name}</TableCell>
        <TableCell className='text-neutral-500'>
          {feedback.user.email}
        </TableCell>
        <TableCell className='max-w-80 truncate text-neutral-700 dark:text-neutral-400'>
          {feedback.message}
        </TableCell>
        <TableCell className='text-sm whitespace-nowrap text-neutral-500'>
          {formattedDate}
        </TableCell>
        <TableCell>
          {feedback.isRead ? (
            <Badge
              variant='outline'
              className='border-neutral-200 text-neutral-500'
            >
              <MailOpen className='mr-1 h-3 w-3' />
              Read
            </Badge>
          ) : (
            <Badge className='border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'>
              <Mail className='mr-1 h-3 w-3' />
              New
            </Badge>
          )}
        </TableCell>
        <TableCell>
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => setIsOpen(true)}
            >
              <Eye className='h-4 w-4' />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={toggleRead}>
                  {feedback.isRead ? (
                    <>
                      <Mail className='mr-2 h-4 w-4' />
                      Mark unread
                    </>
                  ) : (
                    <>
                      <MailOpen className='mr-2 h-4 w-4' />
                      Mark read
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={deleteFeedback}
                  className='text-red-600'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {/* Feedback Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>
              From {feedback.user.name} &lt;{feedback.user.email}&gt;
            </DialogDescription>
          </DialogHeader>
          <div className='mt-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-neutral-700'>
            {feedback.message}
          </div>
          <div className='text-xs text-neutral-400'>
            Received {formattedDate}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
