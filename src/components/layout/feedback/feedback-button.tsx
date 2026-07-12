'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconMessage2Plus } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const feedbackSchema = z.object({
  message: z
    .string()
    .min(1, 'Please enter your feedback')
    .max(2000, 'Feedback must be under 2000 characters')
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export function FeedbackButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema)
  });

  const onSubmit = async (data: FeedbackForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      toast.success('Thanks for your feedback!');
      reset();
      setIsOpen(false);
    } catch {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant='secondary'
        size='icon'
        className='flex size-11 items-center justify-center rounded-lg border-none bg-transparent p-1.5 text-left text-sm shadow-none transition-all duration-75 outline-none hover:bg-neutral-300/60 dark:hover:bg-neutral-600/70'
        onClick={() => setIsOpen(true)}
      >
        <div className='flex items-center justify-center'>
          <IconMessage2Plus className='size-4.5' />
          <span className='sr-only'>Send feedback</span>
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Let us know what&apos;s working, what&apos;s not, or what
              you&apos;d like to see.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
            <Textarea
              rows={5}
              placeholder='Type your feedback here...'
              {...register('message')}
            />
            {errors.message && (
              <p className='text-destructive text-xs'>
                {errors.message.message}
              </p>
            )}
            <DialogFooter>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending...
                  </>
                ) : (
                  'Send Feedback'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
