import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';
import { passkeyClient } from '@better-auth/passkey/client';
import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  inferOrgAdditionalFields,
  lastLoginMethodClient,
  organizationClient,
  twoFactorClient
} from 'better-auth/client/plugins';
import { auth } from './auth';
import { ac, admin } from '../permissions/admin-permissions';
import {
  ac as organizationAc,
  member,
  moderator,
  owner,
  viewer
} from '../permissions/workspace-permissions';
import { stripeClient } from '@better-auth/stripe/client';
import { creemClient } from '@creem_io/better-auth/client';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: BASE_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    passkeyClient(),
    lastLoginMethodClient(),
    twoFactorClient(),
    adminClient({
      ac,
      roles: {
        admin
      }
    }),
    organizationClient({
      organizationAc,
      roles: {
        owner,
        moderator,
        member,
        viewer
      },
      // schema: inferOrgAdditionalFields<typeof auth>(),
      $inferAuth: {} as typeof auth
    }),
    // stripeClient({
    //   subscription: true
    // }),
    creemClient(),
    nextCookies()
  ]
});
