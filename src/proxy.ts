import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth/auth';
import { TRUSTED_ORIGINS } from './lib/api/trusted-origins';

// ── Route definitions ──────────────────────────────────────────────────────────

const AUTH_ROUTE_PREFIX = '/auth';
const ONBOARDING_ROUTE_PREFIX = '/onboarding';

// Exact matches or prefix-safe matches for public pages
const PUBLIC_ROUTES = [
  '/',
  '/legal',
  '/help',
  '/pricing',
  '/about',
  '/contact'
];

// better-auth owns all /api/auth/* routes — always pass through
const PUBLIC_API_PREFIXES = ['/api/auth'];

// Routes that belong to the user globally (not tied to one workspace slug)
const GLOBAL_USER_ROUTES = ['/account', '/workspaces'];

// Workspace-level sub-routes that exist on disk under /[workspace]/
const WORKSPACE_SUB_ROUTES = new Set(['overview', 'settings']);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};

// Ensures the redirect target stays on the same origin (blocks protocol-relative attacks)
function isSafeRedirectPath(p: string): boolean {
  return p.startsWith('/') && !p.startsWith('//');
}

function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((r) => path === r || path.startsWith(r + '/'));
}

export default async function middleware(req: NextRequest) {
  const { pathname: path, origin } = req.nextUrl;
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // 1. API / trpc — enforce origin before passing through.
  //    Better Auth routes (/api/auth/*) are always allowed.
  //    For all other routes, browser requests from untrusted origins are blocked;
  //    server-to-server calls (no Origin header) pass through and individual
  //    withAuth handlers enforce authentication for those.
  if (path.startsWith('/api') || path.startsWith('/trpc')) {
    if (!PUBLIC_API_PREFIXES.some((p) => path.startsWith(p))) {
      const requestOrigin = req.headers.get('origin');
      if (requestOrigin && !TRUSTED_ORIGINS.includes(requestOrigin)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    return NextResponse.next();
  }

  // 2. Public pages — no auth needed.
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // 3. Fetch session — only after ruling out routes that never need it.
  // Fast path: read from cookie cache. If it shows no workspace, do a fresh
  // DB fetch to rule out stale cache (happens right after workspace creation).
  let session = await auth.api.getSession({ headers: req.headers });
  if (session?.user && !session.user.defaultWorkspace) {
    session = await auth.api.getSession({
      query: { disableCookieCache: true },
      headers: req.headers
    });
  }

  const isAuthRoute = path.startsWith(AUTH_ROUTE_PREFIX);
  const isOnboarding = path.startsWith(ONBOARDING_ROUTE_PREFIX);
  const isGlobal = GLOBAL_USER_ROUTES.some((r) => path.startsWith(r));

  // ── UNAUTHENTICATED ──────────────────────────────────────────────────────────
  if (!session) {
    // Auth pages and onboarding landing are accessible without a session.
    if (isAuthRoute || isOnboarding) return NextResponse.next();

    // Everything else requires login; carry the intended destination so the
    // login page can redirect back after a successful sign-in.
    const loginUrl = new URL('/auth/login', origin);
    if (isSafeRedirectPath(path)) {
      loginUrl.searchParams.set('redirect', path);
    }
    return NextResponse.redirect(loginUrl);
  }

  // ── AUTHENTICATED ────────────────────────────────────────────────────────────
  const userSlug = session.user.defaultWorkspace;

  // Shield: a logged-in user has no business on auth pages.
  if (isAuthRoute) {
    const dest = userSlug ? `/${userSlug}/overview` : '/onboarding/workspace';
    return NextResponse.redirect(new URL(dest, origin));
  }

  // No workspace yet — send to onboarding (unless already there).
  if (!userSlug) {
    if (!isOnboarding) {
      return NextResponse.redirect(new URL('/onboarding/workspace', origin));
    }
    return NextResponse.next();
  }

  // Workspace exists — shield onboarding pages.
  if (isOnboarding) {
    return NextResponse.redirect(new URL(`/${userSlug}/overview`, origin));
  }

  // Global routes (/account/*, /workspaces/*) — pass through.
  if (isGlobal) return NextResponse.next();

  // System-admin: require elevated access (accessType > 0).
  if (path.startsWith('/system-admin')) {
    if (!session.user.accessType || session.user.accessType < 1) {
      return NextResponse.redirect(new URL(`/${userSlug}/overview`, origin));
    }
    return NextResponse.next();
  }

  // Auto-prefix: user typed a bare sub-route without a workspace slug
  // e.g. /overview → /{userSlug}/overview
  if (firstSegment && WORKSPACE_SUB_ROUTES.has(firstSegment)) {
    return NextResponse.redirect(
      new URL(`/${userSlug}/${path.slice(1)}`, origin)
    );
  }

  // User's own workspace slug.
  if (firstSegment === userSlug) {
    // /{slug} alone → /{slug}/overview
    if (segments.length === 1) {
      return NextResponse.redirect(new URL(`/${userSlug}/overview`, origin));
    }
    return NextResponse.next();
  }

  // Cross-workspace access: if the path looks like /{other-slug}/{valid-sub-route}[/…]
  // let the page layer handle membership / permission checks.
  if (
    firstSegment &&
    segments.length >= 2 &&
    WORKSPACE_SUB_ROUTES.has(segments[1])
  ) {
    return NextResponse.next();
  }

  // Catch-all: anything else the user typed manually (unknown slug, random path)
  // bounces them back to their own workspace home.
  return NextResponse.redirect(new URL(`/${userSlug}/overview`, origin));
}
