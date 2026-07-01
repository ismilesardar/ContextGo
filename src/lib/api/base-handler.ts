// lib/api/base-handler.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { z } from 'zod';
import { TRUSTED_ORIGINS } from './trusted-origins';

export interface ApiContext {
  userId: string;
  session: any;
  workspaceId?: string;
  isAuthenticated: boolean;
}

export type ApiHandler = (
  req: Request,
  context: {
    params: Record<string, string | string[]>;
    searchParams: URLSearchParams;
    apiContext: ApiContext;
    body?: any;
  }
) => Promise<Response>;

export function withPublicApi(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const origin = req.headers.get('origin');
    if (origin && !TRUSTED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(req);
  };
}

export function withAuth(handler: ApiHandler) {
  return async (
    req: Request,
    { params }: { params: Promise<Record<string, string | string[]>> }
  ) => {
    try {
      const resolvedParams = (await params) || {};
      const searchParams = new URL(req.url).searchParams;
      const headersList = await headers();

      // ALWAYS verify the token for every API call
      // Better Auth automatically checks the Authorization header
      const session = await auth.api.getSession({
        query: { disableCookieCache: true },
        headers: headersList
      });

      // If no session, return 401 immediately
      if (!session?.user) {
        return NextResponse.json(
          {
            error: 'Authentication required',
            code: 'unauthorized',
            message: 'Valid Bearer token or session required'
          },
          { status: 401 }
        );
      }

      const apiContext: ApiContext = {
        userId: session.user.id,
        session: session,
        workspaceId: session.session?.activeOrganizationId ?? undefined,
        isAuthenticated: true
      };

      // Parse body if present
      let body = undefined;
      const contentType = req.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        try {
          body = await req.json();
        } catch (e) {
          // Invalid JSON
        }
      }

      return await handler(req, {
        params: resolvedParams,
        searchParams,
        apiContext,
        body
      });
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal server error', code: 'internal_error' },
        { status: 500 }
      );
    }
  };
}
