/**
 * Client-safe token cost definitions.
 * Extracted from org-token-guard.ts to avoid pulling server-only
 * Prisma dependencies into browser bundles.
 */

export type TokenType = 'system' | 'image';
export type TokenRouteKey = never;

const ROUTE_TOKEN_COSTS: Record<
  TokenRouteKey,
  { tokenType: TokenType; amount: number }
> = {};

export function resolveTokenCost(routeKey: TokenRouteKey) {
  return ROUTE_TOKEN_COSTS[routeKey];
}
