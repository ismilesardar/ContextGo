import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

export const PrivacyView = () => {
  return (
    <div className='h-screen w-full overflow-y-auto'>
      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-400'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to home
        </Link>

        <h1 className='mb-8 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-300'>
          Privacy Policy
        </h1>
        <p className='mb-8 text-sm text-neutral-500'>
          Last updated: June 19, 2026
        </p>

        <div className='prose prose-neutral max-w-none space-y-6 text-neutral-600'>
          <section className='dark:text-neutral-400'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              1. Information We Collect
            </h2>
            <p>
              When you use {APP_NAME}, we collect information you provide
              directly, such as your name, email address, and account details
              when you register. We also collect information about your Amazon
              listings, products, and business data that you choose to upload or
              connect through our platform.
            </p>
            <p>
              We automatically collect certain technical information when you
              use our service, including IP address, browser type, device
              information, and usage data about how you interact with our
              platform.
            </p>
          </section>

          <section className='dark:text-neutral-400'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className='list-disc space-y-2 pl-6'>
              <li>Provide, maintain, and improve our AI-powered tools</li>
              <li>
                Process your listings, images, and content for analysis and
                optimization
              </li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>
                Monitor and analyze trends, usage, and activities in connection
                with our services
              </li>
            </ul>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-400'>
              3. Data Sharing
            </h2>
            <p>
              We do not sell your personal information. We may share your data
              with third-party service providers who help us operate our
              platform, including:
            </p>
            <ul className='list-disc space-y-2 pl-6'>
              <li>
                <strong>Stripe / Creem</strong> — for payment processing
              </li>
              <li>
                <strong>OpenAI / AI providers</strong> — for AI-powered analysis
                and content generation
              </li>
              <li>
                <strong>Cloud hosting providers</strong> — for data storage and
                infrastructure
              </li>
            </ul>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-400'>
              4. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data, including encryption in transit and at rest, regular
              security audits, and access controls. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-400'>
              5. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide you services. You can request deletion of
              your data at any time by contacting us.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-400'>
              6. Your Rights
            </h2>
            <p>
              Depending on your location, you may have rights regarding your
              personal data, including:
            </p>
            <ul className='list-disc space-y-2 pl-6'>
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to delete your data</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
            </ul>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-400'>
              7. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at{' '}
              <a
                href='mailto:shibsa.help@gmail.com'
                className='text-(--brand-color) underline underline-offset-2'
              >
                shibsa.help@gmail.com
              </a>{' '}
              or through our{' '}
              <Link
                href='/contact'
                className='text-(--brand-color) underline underline-offset-2'
              >
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
