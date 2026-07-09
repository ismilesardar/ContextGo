import { NextResponse } from 'next/server';
import { INFINITY_NUMBER } from '@/utils/functions/misc';

export function requireUnderLimit({
  currentCount,
  limit,
  resourceLabel,
  status = 400
}: {
  currentCount: number;
  limit: number;
  resourceLabel: string;
  status?: number;
}): { allowed: true } | { allowed: false; response: NextResponse } {
  if (limit === INFINITY_NUMBER || currentCount < limit) {
    return { allowed: true };
  }

  return {
    allowed: false,
    response: NextResponse.json(
      {
        error: `You've reached your plan's limit of ${limit} ${resourceLabel}`,
        code: 'limit_reached'
      },
      { status }
    )
  };
}
