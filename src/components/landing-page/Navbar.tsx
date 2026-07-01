'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/config/url.config';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-neutral-200 bg-white py-3 shadow-sm'
          : 'border-b border-transparent bg-white py-5'
      }`}
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='group flex items-center gap-2.5'>
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
              <span className='text-lg font-bold tracking-tight text-neutral-900'>
                {APP_NAME}
              </span>
              <span className='text-[10px] font-medium tracking-wider text-(--shibsa-brand-color) uppercase'>
                Amazon Suite
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden items-center gap-8 md:flex'>
            <div className='flex items-center gap-6'>
              <Link
                href='/about'
                className='text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900'
              >
                About Us
              </Link>
              <Link
                href='/pricing'
                className='text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900'
              >
                Pricing
              </Link>
            </div>
            <div className='flex items-center gap-4'>
              <Link
                href='/auth/login'
                className='text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900'
              >
                Sign In
              </Link>
              <Link
                href='/auth/register'
                className='rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800'
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className='p-2 text-neutral-500 transition-colors hover:text-neutral-900 md:hidden'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='overflow-hidden border-b border-neutral-200 bg-white md:hidden'
          >
            <div className='flex flex-col gap-4 px-4 py-6'>
              <Link
                href='/about'
                className='py-2 text-base font-medium text-neutral-500 transition-colors hover:text-neutral-900'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href='/pricing'
                className='py-2 text-base font-medium text-neutral-500 transition-colors hover:text-neutral-900'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              <div className='my-2 h-px bg-neutral-200' />
              <Link
                href='/auth/login'
                className='py-2 text-base font-medium text-neutral-500 transition-colors hover:text-neutral-900'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href='/auth/register'
                className='mt-2 rounded-lg bg-neutral-900 py-3 text-center text-base font-semibold text-white shadow-sm transition-all hover:bg-neutral-800'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
