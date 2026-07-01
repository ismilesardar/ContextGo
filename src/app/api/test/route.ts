import { NextResponse } from 'next/server';
import { withPublicApi } from '@/lib/api/base-handler';

export const GET = withPublicApi(async () => {
  return NextResponse.json({
    success: true,
    message: 'server connection success!'
  });
});
