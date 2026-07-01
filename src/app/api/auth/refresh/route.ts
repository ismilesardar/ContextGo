// app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    const oldToken = authHeader?.replace('Bearer ', '');

    if (!oldToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Use Better Auth to refresh the session
    const session = await auth.api.getSession({
      query: { disableCookieCache: true },
      headers: headersList
    });

    if (!session?.session?.token) {
      return NextResponse.json(
        { error: 'Unable to refresh token' },
        { status: 401 }
      );
    }

    // Return new token with expiration info
    let expiresIn = 3600; // Default 1 hour

    // Try to get expiration from session
    if (session.session.expiresAt) {
      expiresIn = Math.floor(
        (new Date(session.session.expiresAt).getTime() - Date.now()) / 1000
      );
    }

    return NextResponse.json({
      token: session.session.token,
      expiresIn,
      workspaceId: session.session.activeOrganizationId
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
