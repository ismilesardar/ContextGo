import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

export const TermsView = () => {
  return (
    <div className='h-screen w-full overflow-y-auto'>
      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-400'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to home
        </Link>

        <h1 className='mb-8 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-300'>
          Terms of Service
        </h1>
        <p className='mb-8 text-sm text-neutral-500'>
          Last updated: June 19, 2026
        </p>

        <div className='prose prose-neutral max-w-none space-y-6 text-neutral-600'>
          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using {APP_NAME}, you agree to be bound by these
              Terms of Service. If you do not agree, you may not use the
              service.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              2. Description of Service
            </h2>
            <p>
              {APP_NAME} provides AI-powered tools for Amazon sellers. The
              service is provided on a subscription basis with different plan
              tiers.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              3. Account Registration
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities under your account. You
              must provide accurate and complete information when creating an
              account.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              4. Subscriptions & Payments
            </h2>
            <p>
              Paid plans are billed in advance on a monthly or yearly basis.
              Prices are subject to change with notice. You may cancel your
              subscription at any time, with access continuing until the end of
              the current billing period.
            </p>
            <p>
              Free plans include limited features and usage quotas. We reserve
              the right to modify or discontinue free plans at any time.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              5. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className='list-disc space-y-2 pl-6'>
              <li>Use the service for any unlawful purpose</li>
              <li>
                Attempt to access, probe, or connect to systems without
                authorization
              </li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>
                Use the service to infringe upon intellectual property rights
              </li>
              <li>Upload malicious code or content</li>
            </ul>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              6. Intellectual Property
            </h2>
            <p>
              The {APP_NAME} platform, including its software, design, and
              branding, is owned by {APP_NAME} and protected by intellectual
              property laws. Content you create using our tools remains your
              property.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              7. Limitation of Liability
            </h2>
            <p>
              {APP_NAME} is provided &ldquo;as is&rdquo; without warranties of
              any kind. We are not liable for any damages arising from your use
              of the service, including lost profits or business interruption.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              8. Termination
            </h2>
            <p>
              We may suspend or terminate your access if you violate these
              terms. You may terminate your account at any time through your
              account settings.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              9. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify you of
              material changes via email or through the platform. Continued use
              after changes constitutes acceptance.
            </p>
          </section>

          <section className='dark:text-neutral-300'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-300'>
              10. Contact
            </h2>
            <p>
              For questions about these terms, contact us at{' '}
              <a
                href='mailto:shibsa.help@gmail.com'
                className='text-neutral-900 underline underline-offset-2 dark:text-neutral-300'
              >
                shibsa.help@gmail.com
              </a>{' '}
              or through our{' '}
              <Link
                href='/contact'
                className='text-neutral-900 underline underline-offset-2 dark:text-neutral-300'
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
