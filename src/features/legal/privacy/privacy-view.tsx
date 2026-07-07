import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

const SUPPORT_EMAIL = 'support@primiso.app';

export const PrivacyView = () => {
  return (
    <div className='h-screen w-full overflow-y-auto'>
      <div className='mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to home
        </Link>

        <h1 className='text-foreground mb-2 text-3xl font-semibold tracking-tight'>
          Privacy Policy
        </h1>
        <p className='text-muted-foreground mb-8 text-sm'>
          Last updated: July 6, 2026
        </p>

        <div className='prose prose-neutral dark:prose-invert max-w-none space-y-6'>
          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              1. Information We Collect
            </h2>
            <p className='text-muted-foreground'>
              When you use {APP_NAME}, we collect information you provide
              directly, such as your name, email address, and account details
              when you register (including via Google or GitHub sign-in). We
              also collect the organization, project, and resource data you
              create — Contexts, Instructions, Skills, Prompt Templates,
              Checklists, Agent Profiles — and any files you upload.
            </p>
            <p className='text-muted-foreground'>
              We automatically collect certain technical information when you
              use our service, including IP address, browser type, device
              information, and usage data about how you interact with our
              platform.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              2. How We Use Your Information
            </h2>
            <p className='text-muted-foreground'>
              We use the information we collect to:
            </p>
            <ul className='text-muted-foreground list-disc space-y-2 pl-6'>
              <li>Provide, maintain, and improve the platform</li>
              <li>
                Deliver your organization&apos;s published knowledge to the AI
                tools it explicitly connects via MCP or API
              </li>
              <li>
                Send you transactional emails, technical notices, updates, and
                support messages
              </li>
              <li>Respond to your comments, questions, and requests</li>
              <li>
                Monitor and analyze trends, usage, and activity in connection
                with our services, and detect abuse
              </li>
            </ul>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              3. Data Sharing
            </h2>
            <p className='text-muted-foreground'>
              We do not sell your personal information. We share data with the
              following service providers strictly to operate the platform:
            </p>
            <ul className='text-muted-foreground list-disc space-y-2 pl-6'>
              <li>
                <strong>Stripe / Creem</strong> — for payment processing
              </li>
              <li>
                <strong>Backblaze B2</strong> — for storing uploaded files and
                generated artifacts
              </li>
              <li>
                <strong>Google / GitHub</strong> — solely for OAuth sign-in, if
                you choose to use it
              </li>
              <li>
                <strong>Sentry</strong> — for error tracking and reliability
                monitoring
              </li>
              <li>
                <strong>Arcjet</strong> — for rate limiting and abuse prevention
              </li>
            </ul>
            <p className='text-muted-foreground'>
              Our Library feature reads publicly available templates from the
              github/awesome-copilot repository to make them available for
              import — this is a one-way, unauthenticated read of public data;
              no personal information is sent to GitHub as part of this sync.
            </p>
            <p className='text-muted-foreground'>
              When your organization connects an external AI tool (such as
              Claude, ChatGPT, or Cursor) via MCP, that tool receives only the
              specific Resources and Agent Profiles your organization has
              published and explicitly granted to that connection. That
              relationship, and what data flows through it, is controlled
              entirely by your organization&apos;s own configuration — see our{' '}
              <Link
                href='/help/article/mcp-and-ai-integrations'
                className='text-foreground underline underline-offset-2'
              >
                MCP documentation
              </Link>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              4. Data Security
            </h2>
            <p className='text-muted-foreground'>
              We implement industry-standard security measures to protect your
              data, including encryption in transit and at rest, regular
              security audits, and access controls. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              5. Data Retention & Deletion
            </h2>
            <p className='text-muted-foreground'>
              We retain your information for as long as your account is active
              or as needed to provide you services. Archiving a project keeps
              its data intact and recoverable; deleting a project or resource is
              permanent and removes the underlying data immediately. You can
              request deletion of your account and associated data at any time
              by contacting us.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              6. Your Rights
            </h2>
            <p className='text-muted-foreground'>
              Depending on your location, you may have rights regarding your
              personal data, including:
            </p>
            <ul className='text-muted-foreground list-disc space-y-2 pl-6'>
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to delete your data</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
            </ul>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              7. Contact Us
            </h2>
            <p className='text-muted-foreground'>
              If you have questions about this Privacy Policy, please contact us
              at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className='text-foreground underline underline-offset-2'
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              or through our{' '}
              <Link
                href='/contact'
                className='text-foreground underline underline-offset-2'
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
