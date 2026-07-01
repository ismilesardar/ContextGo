'use client';

import { useWorkspaceStore } from '@/store';
import {
  type TokenRouteKey,
  type TokenType,
  resolveTokenCost
} from '@/lib/token-costs';
import type { TooltipProps } from '@/components/ui/tooltip';
import Link from 'next/link';

export interface TokenGuardResult {
  /** Whether the workspace has enough tokens for this action */
  hasEnoughTokens: boolean;
  /** The token type required */
  tokenType: TokenType;
  /** Number of tokens required */
  required: number;
  /** Total tokens available (base + additional) */
  available: number;
  /** Props to pass to DynamicTooltipWrapper — undefined when tokens are sufficient */
  tooltipProps: TooltipProps | undefined;
}

/**
 * Checks whether the current workspace has enough tokens for a given feature.
 *
 * @param routeKey - The feature route key (maps to a token type + cost).
 * @returns `hasEnoughTokens`, `required`, `available`, and `tooltipProps`
 *          to be spread onto `<DynamicTooltipWrapper>`.
 *
 * @example
 * ```tsx
 * const tokenGuard = useTokenGuard(routeKey);
 *
 * <DynamicTooltipWrapper tooltipProps={tokenGuard.tooltipProps}>
 *   <Button disabled={!isValid || mutation.isPending || !tokenGuard.hasEnoughTokens}>
 *     Generate
 *   </Button>
 * </DynamicTooltipWrapper>
 * ```
 */
export function useTokenGuard(routeKey: TokenRouteKey): TokenGuardResult {
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  const cost = resolveTokenCost(routeKey);
  if (!cost) {
    return {
      hasEnoughTokens: true,
      tokenType: 'system',
      required: 0,
      available: 0,
      tooltipProps: undefined
    };
  }

  const { tokenType, amount } = cost;

  const limit =
    tokenType === 'system'
      ? Number(activeWorkspace?.systemTokenLimit ?? 0)
      : Number(activeWorkspace?.imageTokenLimit ?? 0);

  const usage =
    tokenType === 'system'
      ? Number(activeWorkspace?.systemTokenUsage ?? 0)
      : Number(activeWorkspace?.imageTokenUsage ?? 0);

  const additional =
    tokenType === 'system'
      ? Number(activeWorkspace?.additionalSystemToken ?? 0)
      : Number(activeWorkspace?.additionalImageToken ?? 0);

  const additionalUsage =
    tokenType === 'system'
      ? Number(activeWorkspace?.additionalSystemTokenUsage ?? 0)
      : Number(activeWorkspace?.additionalImageTokenUsage ?? 0);

  const availableBase = Math.max(0, limit - usage);
  const availableAdditional = Math.max(0, additional - additionalUsage);
  const totalAvailable = availableBase + availableAdditional;

  const hasEnoughTokens = totalAvailable >= amount;
  const isFreePlan =
    activeWorkspace?.plan?.toLowerCase() === 'free' || !activeWorkspace?.plan;
  const workspaceSlug = activeWorkspace?.slug;

  const tooltipProps: TooltipProps | undefined = hasEnoughTokens
    ? undefined
    : {
        content: ({ setOpen }) => (
          <div className='flex flex-col gap-2 text-sm'>
            <p className='text-balance'>
              {isFreePlan
                ? `This feature requires ${tokenType} tokens. Upgrade to a paid plan to continue.`
                : `You need ${amount} ${tokenType} token${amount > 1 ? 's' : ''} but only have ${totalAvailable} available.`}
            </p>
            <Link
              href={`/${workspaceSlug ?? ''}/settings/billing`}
              onClick={() => setOpen(false)}
              className='text-blue-400 underline underline-offset-2 hover:text-blue-300'
            >
              {isFreePlan ? 'Upgrade plan →' : 'Top up tokens →'}
            </Link>
          </div>
        ),
        align: 'start',
        sideOffset: 6
      };

  return {
    hasEnoughTokens,
    tokenType,
    required: amount,
    available: totalAvailable,
    tooltipProps
  };
}
