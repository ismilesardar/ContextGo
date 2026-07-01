import Image from 'next/image';
import { APP_NAME } from '@/config/url.config';
import SquireBox from '@/components/svg/squire-box';
import { Button } from '@/components/ui/button';
import QuestionRoundSvg from '@/components/svg/question-round-svg';
import Link from 'next/link';
import { getServerSession } from '@/lib/auth/auth-session';
import { OtherAccountLogin } from './other-account-login';

const WelcomeView = async () => {
  const session = await getServerSession();
  const user = session?.user;
  return (
    <div>
      <div className='relative flex min-h-screen flex-col items-center justify-center'>
        <div className='svg-box-outer pointer-events-none inset-x-px inset-y-0 h-screen w-full overflow-hidden mask-intersect opacity-100'>
          <SquireBox size={55} className='size-full opacity-60' />
        </div>
        <div className='absolute inset-0 flex size-full flex-col items-center'>
          <div className='flex max-w-sm flex-col items-center px-4 py-16 text-center'>
            <div className='animate-slide-up-fade animation-duration-[1.3s] fill-mode-[both] relative flex w-auto items-center justify-center px-6 py-2 [--offset:20px]'>
              <div className='absolute inset-y-0 left-1/2 aspect-square -translate-x-1/2 opacity-10 mix-blend-overlay'>
                <div className='size-full -scale-x-[1.8] blur-2xl'>
                  <div className='size-full -rotate-90 bg-[conic-gradient(from_279deg,#EAB308_47deg,#F00_121deg,#00FFF9_190deg,#855AFC_251deg,#3A8BFD_267deg,#A3ECB3_314deg,#EAB308_360deg)] saturate-[3]'></div>
                </div>
              </div>
              <Image
                height={100}
                width={100}
                src='/assets/logos/shibsa-single.png'
                alt={`${APP_NAME} Logo`}
                unoptimized
                className='w-24 md:w-54'
              />
              <div className='absolute inset-y-0 left-1/2 aspect-square -translate-x-1/2 opacity-50 mix-blend-hard-light'>
                <div className='size-full -scale-x-[1.8] blur-2xl'>
                  <div className='size-full -rotate-90 bg-[conic-gradient(from_279deg,#EAB308_47deg,#F00_121deg,#00FFF9_190deg,#855AFC_251deg,#3A8BFD_267deg,#A3ECB3_314deg,#EAB308_360deg)] saturate-[3]'></div>
                </div>
              </div>
            </div>
            <h1 className='animate-slide-up-fade animation-duration-[1s] fill-mode-[both] mt-14 text-xl font-semibold text-neutral-900 [--offset:10px] [animation-delay:250ms] dark:text-neutral-400'>
              Welcome to {APP_NAME}
            </h1>
            <p className='animate-slide-up-fade animation-duration-[1s] fill-mode-[both] mt-2 text-base text-balance text-neutral-500 [--offset:10px] [animation-delay:500ms] dark:text-neutral-400'>
              {APP_NAME} gives you superpowers to track how your marketing
              efforts convert to revenue.
            </p>
            <div className='animate-slide-up-fade animation-duration-[1s] fill-mode-[both] mt-8 w-full [--offset:10px] [animation-delay:750ms]'>
              <Link href='/onboarding/workspace' className='w-full'>
                <Button
                  type='button'
                  className='w-full max-w-md cursor-pointer rounded-md bg-(--brand-color) py-6 text-lg font-medium text-white'
                >
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className='fixed bottom-0 left-0 z-40 m-5 flex flex-col gap-2'>
          <div className='flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400'>
            You're signed in as{' '}
            <b className='text-neutral-800 dark:text-neutral-500'>
              {user?.email}
            </b>
          </div>
          <OtherAccountLogin />
        </div>

        <div className='fixed right-0 bottom-0 z-40 m-5'>
          <div className='flex items-center gap-3'>
            <div className='shrink-0'>
              <Link
                href='/contact/support'
                target='_blank'
                className='text-content-default flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-(--brand-color)/20'
              >
                <QuestionRoundSvg />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
