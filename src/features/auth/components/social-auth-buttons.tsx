'use client';

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS
} from '@/lib/auth/oauth-provider';
import { cn } from '@/lib/utils';

type SocialAuth = {
  lastMethod?: string;
  isSame?: boolean;
  isAllButton?: boolean; // New prop
};

export function SocialAuthButtons({
  lastMethod,
  isSame,
  isAllButton = true
}: SocialAuth) {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const details = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider];
    const Icon = details.Icon;
    const isLastUsed = lastMethod === provider;

    // Logic:
    // 1. If isAllButton is true, show everything regardless.
    // 2. Otherwise, if isSame is true, only show the provider that matches lastMethod.
    if (!isAllButton && isSame && !isLastUsed) {
      return null;
    } else if (!isSame && isLastUsed) {
      return null;
    }

    return (
      <BetterAuthActionButton
        type='button'
        key={provider}
        className={cn(
          'group border-border-subtle text-content-emphasis hover:bg-bg-muted mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 py-6 text-sm whitespace-nowrap transition-all outline-none dark:bg-black',
          // Visually distinguish the last used method
          isLastUsed && 'border-blue-500/50 bg-blue-50/80 dark:dark:bg-black'
        )}
        action={() => {
          return authClient.signIn.social({
            provider,
            callbackURL: '/'
          });
        }}
      >
        <Icon />
        <div className='min-w-0 truncate'>
          Continue with {details.name}
          {isLastUsed && (
            <span className='ml-2 text-[10px] font-medium tracking-wider uppercase opacity-60'>
              (Last used)
            </span>
          )}
        </div>
      </BetterAuthActionButton>
    );
  });
}

// 'use client';

// import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
// import { Button } from '@/components/ui/button';
// import { authClient } from '@/lib/auth/auth-client';
// import {
//   SUPPORTED_OAUTH_PROVIDER_DETAILS,
//   SUPPORTED_OAUTH_PROVIDERS
// } from '@/lib/auth/oauth-provider';

// type SocialAuth = {
//   lastMethod: string;
//   isSame: boolean;
// }

// export function SocialAuthButtons({lastMethod, isSame}: SocialAuth) {
//   return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
//     const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

//     return (
//       <BetterAuthActionButton
//         type='button'
//         className='group border-border-subtle text-content-emphasis hover:bg-bg-muted focus-visible:border-border-emphasis data-[state=open]:border-border-emphasis data-[state=open]:ring-border-subtle mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 py-6 text-sm whitespace-nowrap transition-all outline-none data-[state=open]:ring-4 dark:bg-black'
//         key={provider}
//         action={() => {
//           return authClient.signIn.social({
//             provider,
//             callbackURL: '/'
//           });
//         }}
//       >
//         <Icon />
//         <div className='min-w-0 truncate'>
//           Continue with {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
//         </div>
//       </BetterAuthActionButton>
//     );
//   });
// }
