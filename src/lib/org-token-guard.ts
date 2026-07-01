import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  type TokenType,
  type TokenRouteKey,
  resolveTokenCost
} from '@/lib/token-costs';

export interface TokenGuardResult {
  allowed: boolean;
  response?: Response;
}

export interface TokenSpendResult {
  availableFromBase: number;
  availableFromAdditional: number;
  consumedFromBase: number;
  consumedFromAdditional: number;
  remainingBase: number;
  remainingAdditional: number;
  totalAvailable: number;
}

function getTokenFields(tokenType: TokenType) {
  return tokenType === 'system'
    ? {
        limitField: 'systemTokenLimit' as const,
        usageField: 'systemTokenUsage' as const,
        additionalField: 'additionalSystemToken' as const,
        additionalUsageField: 'additionalSystemTokenUsage' as const
      }
    : {
        limitField: 'imageTokenLimit' as const,
        usageField: 'imageTokenUsage' as const,
        additionalField: 'additionalImageToken' as const,
        additionalUsageField: 'additionalImageTokenUsage' as const
      };
}

export async function requireOrganizationTokens(options: {
  organizationId: string;
  tokenType: TokenType;
  amount?: number;
}): Promise<TokenGuardResult> {
  const amount = Math.max(1, Math.floor(options.amount ?? 1));
  const fields = getTokenFields(options.tokenType);

  const organization = await prisma.organization.findUnique({
    where: { id: options.organizationId },
    select: {
      id: true,
      [fields.limitField]: true,
      [fields.usageField]: true,
      [fields.additionalField]: true,
      [fields.additionalUsageField]: true
    }
  });

  if (!organization) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Organization not found',
          code: 'organization_not_found'
        },
        { status: 404 }
      )
    };
  }

  const baseLimit = Number(organization[fields.limitField] ?? 0);
  const baseUsage = Number(organization[fields.usageField] ?? 0);
  const additional = Number(organization[fields.additionalField] ?? 0);
  const additionalUsage = Number(
    organization[fields.additionalUsageField] ?? 0
  );
  const availableBase = Math.max(0, baseLimit - baseUsage);
  const isSubscriptionActive = await prisma.creem_subscription.findFirst({
    where: {
      referenceId: options.organizationId,
      status: {
        in: ['active', 'trialing']
      }
    },
    select: { id: true }
  });
  const additionalAvailable = isSubscriptionActive
    ? Math.max(0, additional - additionalUsage)
    : 0;
  const totalAvailable = availableBase + additionalAvailable;

  if (totalAvailable < amount) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: `${options.tokenType === 'image' ? 'Image' : 'System'} token is not sufficient to perform this action.`,
          code: 'insufficient_tokens',
          tokenType: options.tokenType,
          required: amount,
          available: totalAvailable
        },
        { status: 402 }
      )
    };
  }

  const consumedFromBase = Math.min(availableBase, amount);
  const consumedFromAdditional = amount - consumedFromBase;

  return {
    allowed: true,
    response: undefined
  };
}

export async function consumeOrganizationTokens(options: {
  organizationId: string;
  tokenType: TokenType;
  amount?: number;
}): Promise<TokenSpendResult> {
  const amount = Math.max(1, Math.floor(options.amount ?? 1));
  const fields = getTokenFields(options.tokenType);

  return await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.findUnique({
      where: { id: options.organizationId },
      select: {
        id: true,
        [fields.limitField]: true,
        [fields.usageField]: true,
        [fields.additionalField]: true,
        [fields.additionalUsageField]: true
      }
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const baseLimit = Number(organization[fields.limitField] ?? 0);
    const baseUsage = Number(organization[fields.usageField] ?? 0);
    const additional = Number(organization[fields.additionalField] ?? 0);
    const additionalUsage = Number(
      organization[fields.additionalUsageField] ?? 0
    );
    const availableBase = Math.max(0, baseLimit - baseUsage);
    const isSubscriptionActive = await tx.creem_subscription.findFirst({
      where: {
        referenceId: options.organizationId,
        status: {
          in: ['active', 'trialing']
        }
      },
      select: { id: true }
    });
    const additionalAvailable = isSubscriptionActive
      ? Math.max(0, additional - additionalUsage)
      : 0;
    const totalAvailable = availableBase + additionalAvailable;

    if (totalAvailable < amount) {
      throw new Error(
        `${options.tokenType === 'image' ? 'Image' : 'System'} token is not sufficient to perform this action.`
      );
    }

    const consumedFromBase = Math.min(availableBase, amount);
    const consumedFromAdditional = amount - consumedFromBase;

    await tx.organization.update({
      where: { id: options.organizationId },
      data: {
        [fields.usageField]: baseUsage + consumedFromBase,
        [fields.additionalUsageField]: additionalUsage + consumedFromAdditional
      }
    });

    return {
      availableFromBase: availableBase,
      availableFromAdditional: additionalAvailable,
      consumedFromBase,
      consumedFromAdditional,
      remainingBase: Math.max(0, baseLimit - (baseUsage + consumedFromBase)),
      remainingAdditional: Math.max(
        0,
        additional - (additionalUsage + consumedFromAdditional)
      ),
      totalAvailable
    };
  });
}
