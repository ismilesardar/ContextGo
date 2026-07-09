import { ReactNode } from 'react';
import { PLANS } from './pricing-plans';
import { nFormatter } from '@/utils/functions/nformatter';

export const PRICING_PLAN_COMPARE_FEATURES: {
  category: string;
  href: string;
  features: {
    text:
      | string
      | ((d: { id: string; plan: (typeof PLANS)[number] }) => ReactNode);
    href?: string;
    check?:
      | boolean
      | {
          default?: boolean;
          free?: boolean;
          pro?: boolean;
          business?: boolean;
          advanced?: boolean;
          enterprise?: boolean;
        };
  }[];
}[] = [
  {
    category: 'Resources & Limits',
    href: '',
    features: [
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.projects)}
            </strong>{' '}
            new projects / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.mcpRequests)}
            </strong>{' '}
            MCP requests / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.mcpIdentities)}
            </strong>{' '}
            new MCP users / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.contexts)}
            </strong>{' '}
            new contexts / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.instructions)}
            </strong>{' '}
            new instructions / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.skills)}
            </strong>{' '}
            new skills / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.promptTemplates)}
            </strong>{' '}
            new prompt templates / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.checklists)}
            </strong>{' '}
            new checklists / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.agentProfiles)}
            </strong>{' '}
            new agent profiles / month
          </>
        )
      },
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.mcpApiKeys)}
            </strong>{' '}
            MCP user per / project
          </>
        )
      }
    ]
  },
  {
    category: 'Team & Workspace',
    href: '',
    features: [
      {
        text: ({ plan }) => (
          <>
            <strong>
              {plan.name === 'Enterprise'
                ? 'Unlimited'
                : nFormatter(plan.limits.users)}
            </strong>{' '}
            team member{plan.limits.users === 1 ? '' : 's'}
          </>
        )
      },
      {
        check: {
          default: true,
          business: true,
          advanced: true,
          enterprise: true
        },
        text: 'Role-based access control (Owner, Moderator, Member, Viewer)'
      },
      {
        check: {
          default: false,
          enterprise: true
        },
        text: 'Audit logs'
      }
    ]
  },
  {
    category: 'Support',
    href: '',
    features: [
      {
        text: ({ id }) => (
          <>
            <strong>
              {
                {
                  free: 'Basic support (email)',
                  pro: 'Elevated support (email)',
                  business: 'Priority support (email)',
                  advanced: 'Priority support via Slack',
                  enterprise: 'Priority support with SLA'
                }[id]
              }
            </strong>
          </>
        )
      },
      {
        check: {
          default: false,
          enterprise: true
        },
        text: () => (
          <>
            <strong>Dedicated</strong> success manager
          </>
        )
      }
    ]
  }
];
