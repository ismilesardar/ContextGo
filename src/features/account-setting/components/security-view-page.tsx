import { Spinner } from '@/components/ui/spinner';
import {
  getAccountListSession,
  getPasskeyList,
  getServerSession
} from '@/lib/auth/auth-session';
import { CreateAccountPassword } from './security-section/create-account-password';
import { ChangePasswordSection } from './security-section/change-password-section';
import { PasskeyViewSection } from './security-section/passkey-view';

export async function SecurityViewPage() {
  const { account, isPasswordAccount } = await getAccountListSession();
  const session = await getServerSession();
  const passkeys = await getPasskeyList();

  return (
    <div className='flex w-full flex-col gap-y-10 pb-10'>
      {account ? (
        <>
          {isPasswordAccount ? (
            <ChangePasswordSection />
          ) : (
            session?.user && (
              <CreateAccountPassword user={session.user} account={account[0]} />
            )
          )}
          <PasskeyViewSection passkeys={passkeys} />
        </>
      ) : (
        <div className='flex size-full items-center justify-center'>
          <Spinner />
        </div>
      )}
    </div>
  );
}
