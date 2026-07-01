'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Check, Loader2 } from 'lucide-react';
import { Navbar, Footer } from '@/components/landing-page';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000)
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to send');
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='h-screen bg-white'>
      <Navbar />

      <div className='mt-20 h-[calc(100%-5rem)] overflow-y-auto'>
        <main className='pt-24 pb-20 md:pt-10 md:pb-28'>
          <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center'
            >
              <h1 className='text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl'>
                Get in touch
              </h1>
              <p className='mt-4 text-lg text-neutral-500'>
                Have a question, feedback, or want to learn more? We&apos;d love
                to hear from you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='mt-12'
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='rounded-xl border border-neutral-200 bg-white p-8 shadow-sm'
              >
                {isSuccess && (
                  <div className='mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                    <Check className='h-4 w-4' />
                    Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}

                <div className='space-y-5'>
                  <div className='grid gap-5 sm:grid-cols-2'>
                    <div>
                      <label
                        htmlFor='name'
                        className='mb-1.5 block text-sm font-medium text-neutral-700'
                      >
                        Name
                      </label>
                      <input
                        id='name'
                        type='text'
                        {...register('name')}
                        placeholder='Your name'
                        className='block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none'
                      />
                      {errors.name && (
                        <p className='mt-1 text-xs text-red-500'>
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor='email'
                        className='mb-1.5 block text-sm font-medium text-neutral-700'
                      >
                        Email
                      </label>
                      <input
                        id='email'
                        type='email'
                        {...register('email')}
                        placeholder='you@example.com'
                        className='block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none'
                      />
                      {errors.email && (
                        <p className='mt-1 text-xs text-red-500'>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='subject'
                      className='mb-1.5 block text-sm font-medium text-neutral-700'
                    >
                      Subject
                    </label>
                    <input
                      id='subject'
                      type='text'
                      {...register('subject')}
                      placeholder='How can we help?'
                      className='block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none'
                    />
                    {errors.subject && (
                      <p className='mt-1 text-xs text-red-500'>
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='mb-1.5 block text-sm font-medium text-neutral-700'
                    >
                      Message
                    </label>
                    <textarea
                      id='message'
                      rows={6}
                      {...register('message')}
                      placeholder="Tell us more about what you're looking for..."
                      className='block w-full resize-y rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none'
                    />
                    {errors.message && (
                      <p className='mt-1 text-xs text-red-500'>
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
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
                  </button>
                </div>
              </form>

              <div className='mt-8 text-center text-sm text-neutral-400'>
                Or email us directly at{' '}
                <a
                  href='mailto:hello@listinglens.com'
                  className='font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700'
                >
                  shibsa.help@gmail.com
                </a>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
