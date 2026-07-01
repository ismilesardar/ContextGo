import SquireBox from '@/components/svg/squire-box';
import { logoLight } from '@/config/image-url';
import { APP_NAME } from '@/config/url.config';
import Image from 'next/image';
import Link from 'next/link';

export default function BoxDesign({
  children,
  boxSize = 85,
  isFooter = true
}: {
  children: React.ReactNode;
  boxSize?: number;
  isFooter?: boolean;
}) {
  return (
    <>
      <div className='relative h-screen w-full overflow-x-hidden overflow-y-scroll p-0'>
        <div className='svg-box-inner pointer-events-none inset-x-px inset-y-0 overflow-hidden mask-intersect opacity-100'>
          <SquireBox size={boxSize} className='h-100 opacity-60' />
        </div>
        <div className='absolute top-0 bottom-0 flex w-full flex-col items-center justify-center'>
          <div className='relative'>
            {/* <div className='absolute top-5 flex flex-col items-center justify-center'> */}
            <Link
              href='/'
              // href='https://shibsa.com'
              // target='_blank'
              className='group absolute top-5 z-10 flex items-center gap-2.5'
            >
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-(--shibsa-brand-color) to-orange-500 shadow-sm transition-shadow group-hover:shadow-md'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M12 2L2 7l10 5 10-5-10-5z' />
                  <path d='M2 17l10 5 10-5' />
                  <path d='M2 12l10 5 10-5' />
                </svg>
              </div>
              <div className='flex flex-col leading-none'>
                <span className='text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-200'>
                  {APP_NAME}
                </span>
                <span className='text-[10px] font-medium tracking-wider text-(--shibsa-brand-color) uppercase'>
                  Amazon Suite
                </span>
              </div>
            </Link>
            {/* </div> */}
            <div className='bg-shibsa-conic h-15 w-50 opacity-80 blur-[70px]'></div>
          </div>
          <div className='flex min-h-[calc(100vh-100px)] w-full flex-col items-center justify-between'>
            {children}
            {isFooter && (
              <footer>
                <div className='flex grow basis-0 flex-col justify-end'>
                  <p className='px-20 py-8 text-center text-xs font-medium text-neutral-500 md:px-0 dark:text-neutral-400'>
                    By continuing, you agree to {APP_NAME}'s
                    <Link
                      href='/legal/terms'
                      target='_blank'
                      className='font-semibold text-neutral-600 hover:text-neutral-800 dark:text-neutral-500'
                    >
                      {' '}
                      Terms of Service{' '}
                    </Link>
                    and
                    <Link
                      href='/legal/privacy'
                      target='_blank'
                      className='font-semibold text-neutral-600 hover:text-neutral-800 dark:text-neutral-500'
                    >
                      {' '}
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </footer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
