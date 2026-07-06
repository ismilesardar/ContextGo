import Link from 'next/link';
import { APP_NAME } from '@/config/url.config';

export default function Footer() {
  return (
    <footer className='border-border bg-background border-t pt-16 pb-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 grid grid-cols-2 gap-8 md:grid-cols-3'>
          {/* Brand - takes full width on mobile, 1 col on desktop */}
          <div className='col-span-2 md:col-span-1 lg:col-span-1'>
            <Link href='/' className='mb-4 flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-(--brand-color) to-orange-500 shadow-sm transition-shadow group-hover:shadow-md'>
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
              <span className='text-foreground text-xl font-bold tracking-tight'>
                {APP_NAME}
              </span>
            </Link>
            <p className='text-muted-foreground mb-4 max-w-56 text-sm leading-relaxed'>
              The centralized knowledge layer for organizations using AI.
            </p>
          </div>

          {/* Columns - evenly distributed */}
          <div>
            <h4 className='text-foreground mb-4 text-sm font-semibold'>
              Product
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/pricing'
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='/help'
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-foreground mb-4 text-sm font-semibold'>
              Company
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/about'
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/legal/privacy'
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/legal/terms'
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-border flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row'>
          <p className='text-muted-foreground text-sm'>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
