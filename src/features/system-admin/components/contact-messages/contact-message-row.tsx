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
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { Icons } from '@/components/icons';
import { MoreHorizontal, Eye, Trash2, MailOpen, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export function ContactMessageRow({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleRead = async () => {
    try {
      const res = await fetch(`/api/contact/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !message.isRead })
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success(message.isRead ? 'Marked as unread' : 'Marked as read');
      router.refresh();
    } catch {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async () => {
    try {
      const res = await fetch(`/api/contact/${message.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Message deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(message.createdAt));

  return (
    <>
      <TableRow className={!message.isRead ? 'bg-emerald-500/40' : ''}>
        <TableCell className='font-medium'>{message.name}</TableCell>
        <TableCell className='text-neutral-500'>{message.email}</TableCell>
        <TableCell className='max-w-50 truncate text-neutral-700 dark:text-neutral-400'>
          {message.subject}
        </TableCell>
        <TableCell className='text-sm whitespace-nowrap text-neutral-500'>
          {formattedDate}
        </TableCell>
        <TableCell>
          {message.isRead ? (
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
                  {message.isRead ? (
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
                  onClick={deleteMessage}
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

      {/* Message Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{message.subject}</DialogTitle>
            <DialogDescription>
              From {message.name} &lt;{message.email}&gt;
            </DialogDescription>
          </DialogHeader>
          <div className='mt-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-neutral-700'>
            {message.message}
          </div>
          <div className='text-xs text-neutral-400'>
            Received {formattedDate}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
