'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/config/url.config';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FEATURES } from './FeatureGrid';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-background fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-border border-b py-3 shadow-sm'
          : 'border-b border-transparent py-5'
      }`}
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='group flex items-center gap-2.5'>
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
            <span className='text-foreground text-lg font-bold tracking-tight uppercase'>
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden items-center gap-8 md:flex'>
            <div className='flex items-center gap-6'>
              <div
                className='relative'
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onMouseLeave={() => setIsFeaturesOpen(false)}
              >
                <button
                  className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors'
                  aria-expanded={isFeaturesOpen}
                >
                  Features
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isFeaturesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className='border-border bg-popover absolute top-full left-1/2 z-50 mt-3 w-140 -translate-x-1/2 rounded-xl border p-3 shadow-lg'
                    >
                      <div className='grid grid-cols-2 gap-1'>
                        {FEATURES.map((feature) => (
                          <div
                            key={feature.title}
                            className='group/item hover:bg-accent flex items-start gap-3 rounded-lg p-3 transition-colors'
                          >
                            <div className='border-border bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md border'>
                              <feature.icon className='text-primary h-4.5 w-4.5' />
                            </div>
                            <div>
                              <p className='text-foreground text-sm font-semibold'>
                                {feature.title}
                              </p>
                              <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                                {feature.desc}
                              </p>
                              <Link
                                href={feature.href}
                                className='text-primary mt-1.5 flex max-h-0 items-center gap-1 text-xs font-medium opacity-0 transition-all duration-200 group-hover/item:max-h-6 group-hover/item:opacity-100'
                                onClick={() => setIsFeaturesOpen(false)}
                              >
                                Learn more
                                <ArrowRight className='h-3 w-3' />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href='/about'
                className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
              >
                About Us
              </Link>
              <Link
                href='/pricing'
                className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
              >
                Pricing
              </Link>
              <Link
                href='/help'
                className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
              >
                Documentation
              </Link>
            </div>
            <div className='flex items-center gap-4'>
              <Link
                href='/auth/login'
                className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
              >
                Sign In
              </Link>
              <Link
                href='/auth/register'
                className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-all'
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className='text-muted-foreground hover:text-foreground p-2 transition-colors md:hidden'
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
            className='bg-background border-border overflow-hidden border-b md:hidden'
          >
            <div className='flex flex-col gap-4 px-4 py-6'>
              <button
                className='text-muted-foreground hover:text-foreground flex items-center justify-between py-2 text-base font-medium transition-colors'
                onClick={() => setIsMobileFeaturesOpen(!isMobileFeaturesOpen)}
                aria-expanded={isMobileFeaturesOpen}
              >
                Features
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isMobileFeaturesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {isMobileFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='-mt-2 overflow-hidden'
                  >
                    <div className='flex flex-col gap-1 pb-2'>
                      {FEATURES.map((feature) => (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          className='hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors'
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsMobileFeaturesOpen(false);
                          }}
                        >
                          <div className='border-border bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-md border'>
                            <feature.icon className='text-primary h-4 w-4' />
                          </div>
                          <span className='text-foreground text-sm font-medium'>
                            {feature.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='bg-border h-px' />

              <Link
                href='/about'
                className='text-muted-foreground hover:text-foreground py-2 text-base font-medium transition-colors'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href='/pricing'
                className='text-muted-foreground hover:text-foreground py-2 text-base font-medium transition-colors'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href='/help'
                className='text-muted-foreground hover:text-foreground py-2 text-base font-medium transition-colors'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documentation
              </Link>

              <div className='bg-border my-2 h-px' />
              <Link
                href='/auth/login'
                className='text-muted-foreground hover:text-foreground py-2 text-base font-medium transition-colors'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href='/auth/register'
                className='bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-lg py-3 text-center text-base font-semibold shadow-sm transition-all'
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
