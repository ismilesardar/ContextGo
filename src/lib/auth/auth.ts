import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  twoFactor,
  admin as adminPlugin,
  organization,
  lastLoginMethod,
  bearer
} from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { emailVerificationCode } from '@/utils/constants/email-verification-code';
import { emailVerificationLink } from '@/utils/constants/email-verification-link';
import {
  APP_NAME,
  BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} from '@/config/url.config';
import { sendMail } from '../send-mail';
import { ac, admin } from '../permissions/admin-permissions';
import {
  member,
  moderator,
  ac as organizationAc,
  owner,
  rolePermissionsMap,
  viewer
} from '../permissions/workspace-permissions';
import { sendOrganizationInviteEmail } from '@/utils/email/organization-invite-email';
import { creem } from '@creem_io/better-auth';

import { createAuthMiddleware } from 'better-auth/api';
import { FREE_PLAN_DEFAULTS } from '@/utils/constants/pricing/pricing-plan-taglines';
import { recordAuditLog } from '../api/audit-logs/record-audit-log';
import prisma from '../prisma';
import { applyPlanToOrganization } from '@/lib/billing/apply-plan-to-organization';

/**
 * Resolve the plan name for a subscription event. Prefers the live product
 * id on the event (always current) over `metadata.planName`, which is only
 * set at original checkout creation and goes stale after an in-app plan
 * change made via the Creem `subscriptions.upgrade` API (which cannot
 * update metadata).
 */
async function resolvePlanNameFromEvent({
  product,
  metadataPlanName
}: {
  product: unknown;
  metadataPlanName: string | undefined;
}): Promise<string | undefined> {
  const productId =
    typeof product === 'object' && product && 'id' in product
      ? (product as { id: string }).id
      : undefined;

  if (productId) {
    const { getPlanAndTierFromPriceId } = await import(
      '@/utils/constants/pricing/pricing-plans'
    );
    const { plan } = getPlanAndTierFromPriceId({ priceId: productId });
    if (plan) return plan.name;
  }

  return metadataPlanName;
}

export const auth = betterAuth({
  appName: `${APP_NAME}`,
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  advanced: {
    crossSubDomainCookies: {
      enabled: true
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60
    },
    additionalFields: {
      activeOrganizationId: {
        type: 'string',
        required: false,
        defaultValue: null
      }
    }
  },
  rateLimit: {
    enabled: true,
    window: 10,
    max: 15
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        subject: 'Reset your password',
        receiver: user.email,
        body: emailVerificationLink(url)
      });
    }
  },
  user: {
    additionalFields: {
      accessType: {
        type: 'number',
        required: false,
        input: false,
        defaultValue: 0
      },
      defaultWorkspace: {
        type: 'string',
        required: false,
        input: true,
        defaultValue: null
      },
      image: {
        type: 'string',
        required: false,
        input: true,
        defaultValue: `${BASE_URL}/assets/users/user_o25.png`
      },
      workspacesCount: {
        type: 'number',
        required: false,
        input: false,
        defaultValue: 0
      },
      workspacesLimit: {
        type: 'number',
        required: false,
        input: false,
        defaultValue: FREE_PLAN_DEFAULTS.workspacesLimit
      }
    },
    deleteUser: {
      enabled: true,
      requirePassword: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendMail({
          subject: 'Confirm account deletion',
          receiver: user.email,
          body: emailVerificationLink(url)
        });
      }
    }
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      await sendMail({
        subject: 'Verify your email',
        receiver: user.email,
        body: emailVerificationLink(url)
      });
    }
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },
  plugins: [
    bearer(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }, ctx) {
          await sendMail({
            subject: 'Verify your email',
            receiver: user.email,
            body: emailVerificationCode({ otp, time: 2 })
          });
        }
      }
    }),
    passkey(),
    lastLoginMethod({
      storeInDatabase: true
    }),
    adminPlugin({
      ac,
      roles: {
        admin
      }
    }),
    organization({
      organizationAc,
      roles: {
        owner,
        moderator,
        member,
        viewer
      },
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email
        });
      },
      disableOrganizationDeletion: false,
      organizationLimit: async (user) => {
        const row = await prisma.user.findUnique({
          where: { id: user.id },
          select: { workspacesCount: true, workspacesLimit: true }
        });
        return (
          (row?.workspacesCount ?? 0) >=
          (row?.workspacesLimit ?? FREE_PLAN_DEFAULTS.workspacesLimit)
        );
      },
      membershipLimit: async (_user, organization) => {
        const row = await prisma.organization.findUnique({
          where: { id: organization.id },
          select: { usersLimit: true }
        });
        return row?.usersLimit ?? FREE_PLAN_DEFAULTS.usersLimit;
      },
      organizationHooks: {
        async afterCreateOrganization(data) {
          const orgId = data.organization.id;
          const now = new Date();
          const nextReset = new Date(now);
          nextReset.setMonth(nextReset.getMonth() + 1);
          // update the organization with the new fields and default values
          await prisma.organization.update({
            where: { id: orgId },
            data: {
              updatedAt: now,
              lastResetDate: now,
              nextResetDate: nextReset
            }
          });
          // user model update
          await prisma.user.update({
            where: { id: data.user.id },
            data: {
              defaultWorkspace: data.organization.slug,
              workspacesCount: { increment: 1 }
            }
          });
        },
        async afterDeleteOrganization(data) {
          const orgId = data.organization.id;

          try {
            await prisma.audit.deleteMany({ where: { workspaceId: orgId } });
          } catch (err) {
            console.error('Failed to clean up workspace data:', err);
          }

          await prisma.user.updateMany({
            where: { id: data.user.id, workspacesCount: { gt: 0 } },
            data: { workspacesCount: { decrement: 1 } }
          });
        },
        async afterUpdateOrganization({ organization, user }) {
          if (organization) {
            await recordAuditLog({
              workspaceId: organization.id,
              action: 'workspace.updated',
              actorId: user.id,
              actorName: user.name ?? '',
              description: `Workspace "${organization.name}" was updated.`,
              targets: [
                {
                  type: 'workspace',
                  id: organization.id,
                  metadata: {
                    name: organization.name,
                    slug: organization.slug,
                    logo: organization.logo ?? ''
                  }
                }
              ]
            });
          }
        }
      },
      schema: {
        organization: {
          additionalFields: {
            creemId: {
              type: 'string',
              required: false,
              defaultValue: null
            },
            plan: {
              type: 'string',
              required: false,
              defaultValue: FREE_PLAN_DEFAULTS.currentPlan
            },
            usersCount: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: 1
            },
            usersLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.usersLimit
            },
            mcpIdentitiesLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.mcpIdentitiesLimit
            },
            mcpApiKeysLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.mcpApiKeysLimit
            },
            projectsLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.projectsLimit
            },
            contextsLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.contextsLimit
            },
            instructionsLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.instructionsLimit
            },
            skillsLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.skillsLimit
            },
            promptTemplatesLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.promptTemplatesLimit
            },
            checklistsLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.checklistsLimit
            },
            agentProfilesLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.agentProfilesLimit
            },
            mcpRequestsLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.mcpRequestsLimit
            },
            lastResetDate: {
              type: 'date',
              required: false,
              defaultValue: new Date()
            },
            nextResetDate: {
              type: 'date',
              required: false
            },
            subscriptionCanceledAt: {
              type: 'date',
              required: false,
              input: false,
              defaultValue: null
            },
            subscriptionEndsAt: {
              type: 'date',
              required: false,
              input: false,
              defaultValue: null
            }
          }
        }
      }
    }),
    creem({
      apiKey: process.env.CREEM_API_KEY!,
      webhookSecret: process.env.CREEM_WEBHOOK_SECRET,
      testMode: !process.env.CREEM_API_KEY?.startsWith('creem_live_'),
      defaultSuccessUrl: '/success',
      persistSubscriptions: true,
      onSubscriptionActive: async ({ customer, product, metadata, status }) => {
        console.log('onSubscriptionActive =>', { metadata, status });
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) {
          console.error(
            'onSubscriptionActive: missing organizationId in metadata',
            metadata
          );
          return;
        }

        const creemCustomerId =
          typeof customer === 'object' && 'id' in customer
            ? (customer as { id: string }).id
            : undefined;

        const planName = await resolvePlanNameFromEvent({
          product,
          metadataPlanName: metadata?.planName as string | undefined
        });
        if (!planName) {
          console.error(
            'onSubscriptionActive: could not resolve a plan from product or metadata',
            metadata
          );
          return;
        }

        const updated = await applyPlanToOrganization({
          organizationId,
          planName,
          creemCustomerId
        });
        if (updated) {
          console.log(
            `onSubscriptionActive: updated organization ${organizationId} to plan "${planName}"`
          );
        }
      },
      onSubscriptionUpdate: async ({ customer, product, metadata, status }) => {
        console.log('onSubscriptionUpdate =>', { metadata, status });
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) {
          console.error(
            'onSubscriptionUpdate: missing organizationId in metadata',
            metadata
          );
          return;
        }

        const creemCustomerId =
          typeof customer === 'object' && 'id' in customer
            ? (customer as { id: string }).id
            : undefined;

        const planName = await resolvePlanNameFromEvent({
          product,
          metadataPlanName: metadata?.planName as string | undefined
        });
        if (!planName) {
          console.error(
            'onSubscriptionUpdate: could not resolve a plan from product or metadata',
            metadata
          );
          return;
        }

        // `subscription.update` fires for any change to the subscription
        // (plan swaps via checkout/portal/direct API, seat changes, etc.),
        // not specifically a billing-period renewal — resetting the usage
        // window here would let a customer reset their resource-creation
        // quota on demand just by toggling plans. Only a genuine renewal
        // (onSubscriptionPaid, below) or a brand-new subscription
        // (onSubscriptionActive, above) should do that.
        const updated = await applyPlanToOrganization({
          organizationId,
          planName,
          creemCustomerId,
          resetUsageWindow: false
        });
        if (updated) {
          console.log(
            `onSubscriptionUpdate: updated organization ${organizationId} to plan "${planName}"`
          );
        }
      },
      onSubscriptionPaid: async ({ customer, product, metadata }) => {
        console.log('onSubscriptionPaid =>', metadata);
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) {
          console.error(
            'onSubscriptionPaid: missing organizationId in metadata',
            metadata
          );
          return;
        }

        const creemCustomerId =
          typeof customer === 'object' && customer && 'id' in customer
            ? (customer as { id: string }).id
            : undefined;

        const planName = await resolvePlanNameFromEvent({
          product,
          metadataPlanName: metadata?.planName as string | undefined
        });

        if (!planName) {
          // No resolvable plan (e.g. a one-time/non-plan payment) — still
          // record the renewed billing window and customer id.
          const result = await prisma.organization.updateMany({
            where: { id: organizationId },
            data: {
              subscriptionCanceledAt: null,
              subscriptionEndsAt: null,
              ...(creemCustomerId ? { creemId: creemCustomerId } : {})
            }
          });
          if (result.count === 0) {
            console.error(
              `onSubscriptionPaid: no organization matched id "${organizationId}"`
            );
          }
          return;
        }

        const updated = await applyPlanToOrganization({
          organizationId,
          planName,
          creemCustomerId
        });
        if (updated) {
          console.log(
            `onSubscriptionPaid: updated organization ${organizationId} to plan "${planName}"`
          );
        }
      },
      onSubscriptionCanceled: async ({
        metadata,
        status,
        current_period_end_date
      }) => {
        // The subscription remains active (paid plan + limits stay in effect)
        // until the current billing period actually ends. Creem sends
        // "subscription.expired" at that point, which is what performs the
        // downgrade to Free — see onSubscriptionExpired below. This handler
        // just records that a cancellation is pending, so the UI can hide
        // the cancel action and show when access will end.
        console.log('onSubscriptionCanceled =>', metadata, status);
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) {
          console.error(
            'onSubscriptionCanceled: missing organizationId in metadata',
            metadata
          );
          return;
        }

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            subscriptionCanceledAt: new Date(),
            subscriptionEndsAt: current_period_end_date
              ? new Date(current_period_end_date)
              : null
          }
        });

        if (result.count === 0) {
          console.error(
            `onSubscriptionCanceled: no organization matched id "${organizationId}"`
          );
        }
      },
      onSubscriptionExpired: async ({ metadata, status }) => {
        console.log('onSubscriptionExpired =>', metadata, status);
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) return;

        const now = new Date();
        const nextReset = new Date(now);
        nextReset.setMonth(nextReset.getMonth() + 1);

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            plan: 'Free',
            lastResetDate: now,
            nextResetDate: nextReset,
            subscriptionCanceledAt: null,
            subscriptionEndsAt: null,
            usersLimit: FREE_PLAN_DEFAULTS.usersLimit,
            mcpIdentitiesLimit: FREE_PLAN_DEFAULTS.mcpIdentitiesLimit,
            mcpApiKeysLimit: FREE_PLAN_DEFAULTS.mcpApiKeysLimit,
            projectsLimit: FREE_PLAN_DEFAULTS.projectsLimit,
            contextsLimit: FREE_PLAN_DEFAULTS.contextsLimit,
            instructionsLimit: FREE_PLAN_DEFAULTS.instructionsLimit,
            skillsLimit: FREE_PLAN_DEFAULTS.skillsLimit,
            promptTemplatesLimit: FREE_PLAN_DEFAULTS.promptTemplatesLimit,
            checklistsLimit: FREE_PLAN_DEFAULTS.checklistsLimit,
            agentProfilesLimit: FREE_PLAN_DEFAULTS.agentProfilesLimit,
            mcpRequestsLimit: FREE_PLAN_DEFAULTS.mcpRequestsLimit
          }
        });

        if (result.count === 0) {
          return;
        }
      },
      onSubscriptionUnpaid: async ({ metadata, status }) => {
        console.log('onSubscriptionUnpaid =>', metadata, status);
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) return;

        const now = new Date();
        const nextReset = new Date(now);
        nextReset.setMonth(nextReset.getMonth() + 1);

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            plan: 'Free',
            lastResetDate: now,
            nextResetDate: nextReset,
            usersLimit: FREE_PLAN_DEFAULTS.usersLimit,
            mcpIdentitiesLimit: FREE_PLAN_DEFAULTS.mcpIdentitiesLimit,
            mcpApiKeysLimit: FREE_PLAN_DEFAULTS.mcpApiKeysLimit,
            projectsLimit: FREE_PLAN_DEFAULTS.projectsLimit,
            contextsLimit: FREE_PLAN_DEFAULTS.contextsLimit,
            instructionsLimit: FREE_PLAN_DEFAULTS.instructionsLimit,
            skillsLimit: FREE_PLAN_DEFAULTS.skillsLimit,
            promptTemplatesLimit: FREE_PLAN_DEFAULTS.promptTemplatesLimit,
            checklistsLimit: FREE_PLAN_DEFAULTS.checklistsLimit,
            agentProfilesLimit: FREE_PLAN_DEFAULTS.agentProfilesLimit,
            mcpRequestsLimit: FREE_PLAN_DEFAULTS.mcpRequestsLimit
          }
        });

        if (result.count === 0) {
          return;
        }
      }
    })
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/register')) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email
        };

        if (user) {
          await sendMail({
            subject: 'Welcome to ' + APP_NAME,
            receiver: user.email,
            body: `Hi ${user.name || ''},<br/><br/>Welcome to ${APP_NAME}! We're excited to have you on board.<br/><br/>Best regards,<br/>The ${APP_NAME} Team`
          });
        }
      }

      if (ctx.path.endsWith('/get-full-organization')) {
        const response = ctx.context.returned as { members?: any[] };

        // Ensure the response exists and has members
        if (response && response?.members) {
          response.members = response.members.map((m: any) => ({
            ...m,
            // Map the role string (e.g., 'moderator') to the actual permission object
            permissions:
              m.role === 'owner'
                ? 'all'
                : rolePermissionsMap[
                    m.role as keyof typeof rolePermissionsMap
                  ] || rolePermissionsMap.viewer
          }));
        }

        return response;
      }
    })
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const account = await prisma.account.findFirst({
            where: { userId: user.id }
          });

          if (account && account.providerId === 'credential') {
            await prisma.user.update({
              where: { id: user.id },
              data: { twoFactorEnabled: true }
            });
          }
        }
      }
    },
    session: {
      create: {
        before: async (userSession) => {
          const membership = await prisma.member.findFirst({
            where: { userId: userSession.userId },
            orderBy: { createdAt: 'desc' },
            select: { organizationId: true }
          });

          return {
            data: {
              activeOrganizationId:
                membership?.organizationId?.toString() ?? null
            }
          };
        }
      }
    }
  },
  trustedOrigins: ['http://localhost:3000', BASE_URL]
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization;
export type ActiveOrganizationMember =
  (typeof auth.$Infer.ActiveOrganization.members)[number];
