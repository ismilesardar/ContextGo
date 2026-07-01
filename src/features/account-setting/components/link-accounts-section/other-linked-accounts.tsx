import { auth } from '@/lib/auth/auth';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/auth/oauth-provider';
import { LinkAccountCard } from './link-account-card';

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export const OtherLinkedAccounts = ({
  currentAccounts
}: {
  currentAccounts: Account[];
}) => {
  return (
    <div className='space-y-2'>
      <h1 className='text-2xl font-bold'>Linked Other Accounts</h1>
      <div className='grid gap-3'>
        {SUPPORTED_OAUTH_PROVIDERS.filter(
          (provider) =>
            !currentAccounts.find((account) => account.providerId === provider)
        ).map((provider) => (
          <LinkAccountCard key={provider} provider={provider} />
        ))}
      </div>
    </div>
  );
};
