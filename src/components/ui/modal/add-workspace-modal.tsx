import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { toast } from 'sonner';
import { CustomModal } from '../custom-model';
import { CreateWorkspaceForm } from '../workspaces/create-workspace-form';
import Image from 'next/image';
import { APP_NAME } from '@/config/url.config';
import Link from 'next/link';

function AddWorkspaceModalHelper({
  showAddWorkspaceModal,
  setShowAddWorkspaceModal
}: {
  showAddWorkspaceModal: boolean;
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const oauthFlow = pathname.startsWith('/oauth/authorize');

  const searchParams = useSearchParams();

  return (
    <CustomModal
      showModal={showAddWorkspaceModal}
      setShowModal={setShowAddWorkspaceModal}
    >
      {/* onClose={ } */}
      <div className='flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 px-4 py-4 pt-8 sm:px-16 dark:border-neutral-600'>
        {/* <div className='flex size-11 items-center justify-center rounded-full shadow'> */}
        <Image
          unoptimized
          src='/assets/logos/shibsa-single.png'
          alt={`${APP_NAME} a software company`}
          width={100}
          height={100}
          className='animate-in fade-in size-12 rounded-full object-cover'
        />
        {/* </div> */}
        <h3 className='text-lg font-medium'>Create a workspace</h3>
        <p className='-translate-y-2 text-center text-xs text-balance text-neutral-500 dark:text-neutral-400'>
          Set up a common space to manage your links with your team.{' '}
          <Link
            href='https://dub.co/help/article/what-is-a-workspace'
            target='_blank'
            className='cursor-help font-medium underline decoration-dotted underline-offset-2 transition-colors hover:text-neutral-700'
          >
            Learn more.
          </Link>
        </p>
      </div>

      <CreateWorkspaceForm
        className='px-4 py-8 sm:px-16'
        onSuccess={({ slug }) => {
          if (oauthFlow) {
            router.refresh();
          } else {
            // router.push(`/${slug}/overview`);
            window.location.href = `/${slug}/overview`;
            toast.success('Successfully created workspace!');
          }
          setShowAddWorkspaceModal(false);
        }}
      />
    </CustomModal>
  );
}

export function useAddWorkspaceModal() {
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false);

  const AddWorkspaceModal = useCallback(() => {
    return (
      <AddWorkspaceModalHelper
        showAddWorkspaceModal={showAddWorkspaceModal}
        setShowAddWorkspaceModal={setShowAddWorkspaceModal}
      />
    );
  }, [showAddWorkspaceModal, setShowAddWorkspaceModal]);

  return useMemo(
    () => ({ setShowAddWorkspaceModal, AddWorkspaceModal }),
    [setShowAddWorkspaceModal, AddWorkspaceModal]
  );
}
