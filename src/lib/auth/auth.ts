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
  GOOGLE_CLIENT_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET
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

import Stripe from 'stripe';
import { stripe } from '@better-auth/stripe';
import { createAuthMiddleware } from 'better-auth/api';
import { STRIPE_PLANS } from '../plans/stripe';
import { ROLES } from '@/utils/constants/organization-const';
import { FREE_PLAN_DEFAULTS } from '@/utils/constants/pricing/pricing-plan-taglines';
import { recordAuditLog } from '../api/audit-logs/record-audit-log';
import prisma from '../prisma';

// const stripeClient = new Stripe(STRIPE_SECRET_KEY!, {
//   apiVersion: '2026-02-25.clover'
// });

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
        defaultValue: 1
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
      organizationHooks: {
        async afterCreateOrganization(data) {
          const orgId = data.organization.id;
          // update the organization with the new fields and default values
          await prisma.organization.update({
            where: { id: orgId },
            data: {
              updatedAt: new Date()
            }
          });
          // user model update
          await prisma.user.update({
            where: { id: data.user.id },
            data: {
              defaultWorkspace: data.organization.slug
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
            systemTokenLimit: {
              type: 'number',
              required: false,
              defaultValue: FREE_PLAN_DEFAULTS.systemTokenLimit
            },
            systemTokenUsage: {
              type: 'number',
              required: false,
              defaultValue: 0
            },
            imageTokenLimit: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: FREE_PLAN_DEFAULTS.imageTokenLimit
            },
            imageTokenUsage: {
              type: 'number',
              required: false,
              input: false,
              defaultValue: 0
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
            additionalSystemToken: {
              type: 'number',
              required: false,
              defaultValue: 0
            },
            additionalSystemTokenUsage: {
              type: 'number',
              required: false,
              defaultValue: 0
            },
            additionalImageToken: {
              type: 'number',
              required: false,
              defaultValue: 0
            },
            additionalImageTokenUsage: {
              type: 'number',
              required: false,
              defaultValue: 0
            },
            lastResetDate: {
              type: 'date',
              required: false,
              defaultValue: new Date()
            },
            nextResetDate: {
              type: 'date',
              required: false
            }
          }
        }
      }
    }),
    // stripe({
    //   stripeClient,
    //   stripeWebhookSecret: STRIPE_WEBHOOK_SECRET!,
    //   createCustomerOnSignUp: true,
    //   subscription: {
    //     enabled: true,
    //     plans: STRIPE_PLANS,
    //     authorizeReference: async ({ user, referenceId, action }) => {
    //       const memberItem = await prisma.member.findFirst({
    //         where: {
    //           organizationId: referenceId,
    //           userId: user.id
    //         }
    //       });

    //       if (
    //         action === 'upgrade-subscription' ||
    //         action === 'cancel-subscription' ||
    //         action === 'restore-subscription'
    //       ) {
    //         return memberItem?.role === ROLES.OWNER;
    //       }

    //       return memberItem != null;
    //     }
    //   }
    // }),
    creem({
      apiKey: process.env.CREEM_API_KEY!,
      webhookSecret: process.env.CREEM_WEBHOOK_SECRET,
      testMode: true,
      defaultSuccessUrl: '/success',
      persistSubscriptions: true,
      onCheckoutCompleted: async ({ customer, metadata, subscription }) => {
        const organizationId = metadata?.organizationId as string | undefined;
        if (!organizationId) return;

        // ── Detect one-time top-up purchases ──
        const topUpType = metadata?.topUpType as string | undefined;
        const topUpAmount = metadata?.topUpAmount
          ? parseInt(metadata.topUpAmount as string, 10)
          : 0;

        if (topUpType && topUpAmount > 0) {
          const field =
            topUpType === 'system'
              ? 'additionalSystemToken'
              : 'additionalImageToken';

          const topUpDollars = metadata?.topUpDollars
            ? parseInt(metadata.topUpDollars as string, 10)
            : 0;

          await prisma.$transaction([
            prisma.organization.update({
              where: { id: organizationId },
              data: { [field]: { increment: topUpAmount } }
            }),
            prisma.topUpPurchase.create({
              data: {
                workspaceId: organizationId,
                amount: topUpDollars,
                tokens: topUpAmount,
                tokenType: topUpType
              }
            })
          ]);
          return;
        }
      },
      onSubscriptionActive: async ({ customer, metadata, status }) => {
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        const planName = metadata?.planName as string | undefined;
        if (!organizationId || !planName) return;

        const planPeriod = metadata?.planPeriod as string | undefined;
        const creemCustomerId =
          typeof customer === 'object' && 'id' in customer
            ? (customer as { id: string }).id
            : undefined;

        const { PLANS } = await import(
          '@/utils/constants/pricing/pricing-plans'
        );
        const planTemplate = PLANS.find(
          (p) => p.name.toLowerCase() === planName.toLowerCase()
        );

        const now = new Date();
        const nextReset = new Date(now);
        nextReset.setDate(
          nextReset.getDate() + (planPeriod === 'yearly' ? 365 : 30)
        );

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            plan: planName,
            creemId: creemCustomerId,
            lastResetDate: now,
            nextResetDate: nextReset,
            systemTokenLimit: planTemplate?.limits.systemToken ?? 100,
            systemTokenUsage: 0,
            imageTokenLimit: planTemplate?.limits.imageToken ?? 0,
            imageTokenUsage: 0,
            usersLimit: planTemplate?.limits.users ?? 0
          }
        });

        if (result.count === 0) {
          return;
        }
      },
      onSubscriptionUpdate: async ({ customer, metadata, status }) => {
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        const planName = metadata?.planName as string | undefined;
        if (!organizationId || !planName) return;

        const planPeriod = metadata?.planPeriod as string | undefined;
        const creemCustomerId =
          typeof customer === 'object' && 'id' in customer
            ? (customer as { id: string }).id
            : undefined;

        const { PLANS } = await import(
          '@/utils/constants/pricing/pricing-plans'
        );
        const planTemplate = PLANS.find(
          (p) => p.name.toLowerCase() === planName.toLowerCase()
        );

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            plan: planName,
            creemId: creemCustomerId,
            systemTokenLimit: planTemplate?.limits.systemToken ?? 100,
            imageTokenLimit: planTemplate?.limits.imageToken ?? 0,
            usersLimit: planTemplate?.limits.users ?? 0
          }
        });

        if (result.count === 0) {
          return;
        }
      },
      onSubscriptionPaid: async ({ metadata }) => {
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) return;

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            systemTokenUsage: 0,
            imageTokenUsage: 0,
            lastResetDate: new Date(),
            nextResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });

        if (result.count === 0) {
          return;
        }
      },
      onSubscriptionCanceled: async ({ metadata, status }) => {
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) return;

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            plan: 'Free',
            systemTokenLimit: FREE_PLAN_DEFAULTS.systemTokenLimit,
            systemTokenUsage: 0,
            imageTokenLimit: FREE_PLAN_DEFAULTS.imageTokenLimit,
            imageTokenUsage: 0,
            usersLimit: FREE_PLAN_DEFAULTS.usersLimit
          }
        });

        if (result.count === 0) {
          return;
        }
      },
      onSubscriptionExpired: async ({ metadata, status }) => {
        const organizationId =
          (metadata?.organizationId as string | undefined) ??
          (metadata?.referenceId as string | undefined);
        if (!organizationId) return;

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            plan: 'Free',
            systemTokenLimit: FREE_PLAN_DEFAULTS.systemTokenLimit,
            systemTokenUsage: 0,
            imageTokenLimit: FREE_PLAN_DEFAULTS.imageTokenLimit,
            imageTokenUsage: 0,
            usersLimit: FREE_PLAN_DEFAULTS.usersLimit
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

        const result = await prisma.organization.updateMany({
          where: { id: organizationId },
          data: {
            plan: 'Free',
            systemTokenLimit: FREE_PLAN_DEFAULTS.systemTokenLimit,
            systemTokenUsage: 0,
            imageTokenLimit: FREE_PLAN_DEFAULTS.imageTokenLimit,
            imageTokenUsage: 0,
            usersLimit: FREE_PLAN_DEFAULTS.usersLimit
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
