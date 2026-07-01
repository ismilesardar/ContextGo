'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { useUserSession } from '@/hooks/use-client-session';
import { useWorkspaceStore } from '@/store';
import { Send, Check, Loader2, Building2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function EnterpriseContactModal({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const { user } = useUserSession();
  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length < 10) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || 'Unknown',
          email: user?.email || 'unknown@email.com',
          subject: `Enterprise Inquiry - ${activeWorkspace?.name || 'Unknown Organization'}`,
          message: message.trim()
        })
      });
      if (!res.ok) throw new Error('Failed to send');

      setIsSuccess(true);
      toast.success('Message sent! Our team will get back to you soon.');
      setMessage('');
      setTimeout(() => {
        setIsSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal showModal={open} setShowModal={onOpenChange}>
      <div className='flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 px-4 py-4 pt-8 sm:px-5 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Contact Sales</h3>
        <p className='-translate-y-2 text-center text-xs text-balance text-neutral-500 dark:text-neutral-400'>
          Tell us about your Enterprise needs and we&apos;ll get back to you.
        </p>
      </div>

      <div className='space-y-4 px-4 py-8 sm:px-5'>
        {/* Auto-filled user info */}
        <div className='space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900'>
          <div className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400'>
            <Building2 className='h-4 w-4 text-neutral-400' />
            <span className='font-medium text-neutral-900 dark:text-neutral-200'>
              {activeWorkspace?.name || 'Unknown Organization'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400'>
            <Mail className='h-4 w-4 text-neutral-400' />
            <span>{user?.email || 'Unknown'}</span>
          </div>
        </div>

        {isSuccess ? (
          <div className='flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
            <Check className='h-4 w-4 shrink-0' />
            Message sent successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='enterprise-message'
                className='mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300'
              >
                Message
              </label>
              <textarea
                id='enterprise-message'
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your requirements, scale, and what you're looking for in an Enterprise plan..."
                className='block w-full resize-y rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'
              />
              {message.length > 0 && message.length < 10 && (
                <p className='mt-1 text-xs text-red-500'>
                  Message must be at least 10 characters
                </p>
              )}
            </div>

            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting || message.length < 10}
                className='gap-2'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className='h-4 w-4' />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </CustomModal>
  );
}
