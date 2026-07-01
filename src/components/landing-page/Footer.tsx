import Link from 'next/link';
import { APP_NAME } from '@/config/url.config';

export default function Footer() {
  return (
    <footer className='border-t border-neutral-200 bg-white pt-16 pb-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 grid grid-cols-2 gap-8 md:grid-cols-3'>
          {/* Brand - takes full width on mobile, 1 col on desktop */}
          <div className='col-span-2 md:col-span-1 lg:col-span-1'>
            <Link href='/' className='mb-4 flex items-center gap-2'>
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
              <span className='text-xl font-bold tracking-tight text-neutral-900'>
                {APP_NAME}
              </span>
            </Link>
            <p className='mb-4 max-w-56 text-sm leading-relaxed text-neutral-500'>
              AI-powered tools for Amazon sellers to grow smarter.
            </p>
          </div>

          {/* Columns - evenly distributed */}
          <div>
            <h4 className='mb-4 text-sm font-semibold text-neutral-900'>
              Product
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/pricing'
                  className='text-sm text-neutral-500 transition-colors hover:text-neutral-900'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-sm text-neutral-500 transition-colors hover:text-neutral-900'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='mb-4 text-sm font-semibold text-neutral-900'>
              Company
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/about'
                  className='text-sm text-neutral-500 transition-colors hover:text-neutral-900'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-sm text-neutral-500 transition-colors hover:text-neutral-900'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/legal/privacy'
                  className='text-sm text-neutral-500 transition-colors hover:text-neutral-900'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/legal/terms'
                  className='text-sm text-neutral-500 transition-colors hover:text-neutral-900'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 md:flex-row'>
          <p className='text-sm text-neutral-400'>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className='flex items-center gap-6'>
            <Link
              href='https://www.facebook.com/profile.php?id=61589738752648'
              target='_blank'
              className='text-neutral-400 transition-colors hover:text-neutral-900'
            >
              <span className='sr-only'>Facebook</span>
              <svg
                className='h-5 w-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
            {/* <Link
              href='#'
              className='text-neutral-400 transition-colors hover:text-neutral-900'
            >
              <span className='sr-only'>Twitter</span>
              <svg
                className='h-5 w-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
              </svg>
            </Link> */}
            <Link
              href='https://www.linkedin.com/company/shibsa'
              target='_blank'
              className='text-neutral-400 transition-colors hover:text-neutral-900'
            >
              <span className='sr-only'>LinkedIn</span>
              <svg
                className='h-5 w-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
