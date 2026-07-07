import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

const SUPPORT_EMAIL = 'support@primiso.app';

export const TermsView = () => {
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
          Terms of Service
        </h1>
        <p className='text-muted-foreground mb-8 text-sm'>
          Last updated: July 6, 2026
        </p>

        <div className='prose prose-neutral dark:prose-invert max-w-none space-y-6'>
          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              1. Acceptance of Terms
            </h2>
            <p className='text-muted-foreground'>
              By accessing or using {APP_NAME}, you agree to be bound by these
              Terms of Service. If you do not agree, you may not use the
              service.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              2. Description of Service
            </h2>
            <p className='text-muted-foreground'>
              {APP_NAME} is a multi-tenant knowledge-management platform for
              organizations. It lets you organize, version, and publish
              project-specific knowledge — Contexts, Instructions, Skills,
              Prompt Templates, Checklists, and Agent Profiles — and exposes
              your approved content to AI tools (such as Claude, ChatGPT, or
              Cursor) that your organization chooses to connect via our MCP
              server and API. The service is provided on a subscription basis
              with different plan tiers, billed per organization.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              3. Account Registration
            </h2>
            <p className='text-muted-foreground'>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities under your account. You
              must provide accurate and complete information when creating an
              account. Accounts may be created with an email/password, or
              through Google or GitHub sign-in.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              4. Organizations, Projects & Roles
            </h2>
            <p className='text-muted-foreground'>
              Content you create lives inside an Organization and one or more
              Projects. Projects are isolated workspaces — knowledge created in
              one project is never accessible from another unless your
              organization explicitly supports that in the future. Access within
              an organization is controlled by roles (owner, moderator, member,
              viewer); you are responsible for who your organization admins
              grant access to.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              5. Subscriptions & Payments
            </h2>
            <p className='text-muted-foreground'>
              Paid plans are billed per organization, in advance, on a monthly
              or yearly basis. Prices are subject to change with notice. You may
              cancel your subscription at any time, with access continuing until
              the end of the current billing period.
            </p>
            <p className='text-muted-foreground'>
              Free plans include limited features and usage quotas. We reserve
              the right to modify or discontinue free plans at any time.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              6. Acceptable Use
            </h2>
            <p className='text-muted-foreground'>You agree not to:</p>
            <ul className='text-muted-foreground list-disc space-y-2 pl-6'>
              <li>Use the service for any unlawful purpose</li>
              <li>
                Attempt to access, probe, or connect to systems, projects, or
                organizations without authorization
              </li>
              <li>
                Interfere with or disrupt the service, including the MCP server
                or API
              </li>
              <li>
                Publish content through the service that you do not have the
                rights to share with your organization&apos;s connected AI tools
              </li>
              <li>Upload malicious code or content</li>
            </ul>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              7. Content & Intellectual Property
            </h2>
            <p className='text-muted-foreground'>
              The {APP_NAME} platform, including its software, design, and
              branding, is owned by {APP_NAME} and protected by intellectual
              property laws. Contexts, Instructions, Skills, Prompt Templates,
              Checklists, and Agent Profiles you create remain your
              organization&apos;s property. Templates imported through the
              Library feature originate from the public github/awesome-copilot
              repository and remain subject to that project&apos;s own license;
              imported content retains an attribution note back to its source.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              8. AI Tool Access (MCP)
            </h2>
            <p className='text-muted-foreground'>
              {APP_NAME} lets your organization connect external AI tools (such
              as Claude, ChatGPT, or Cursor) through the Model Context Protocol
              (MCP). Only content your organization has explicitly published and
              granted to a given connection is ever exposed. You are responsible
              for managing which AI tools your organization connects and what
              access you grant them. {APP_NAME} does not itself operate as an AI
              model provider and does not use your content to train any model.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              9. Limitation of Liability
            </h2>
            <p className='text-muted-foreground'>
              {APP_NAME} is provided &ldquo;as is&rdquo; without warranties of
              any kind. We are not liable for any damages arising from your use
              of the service, including lost profits or business interruption.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              10. Termination
            </h2>
            <p className='text-muted-foreground'>
              We may suspend or terminate your access if you violate these
              terms. You may terminate your account at any time through your
              account settings.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              11. Changes to Terms
            </h2>
            <p className='text-muted-foreground'>
              We may update these terms from time to time. We will notify you of
              material changes via email or through the platform. Continued use
              after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className='text-foreground text-xl font-semibold'>
              12. Contact
            </h2>
            <p className='text-muted-foreground'>
              For questions about these terms, contact us at{' '}
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
