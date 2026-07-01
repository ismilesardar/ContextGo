'use client';

import { Icons } from '@/components/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { BASE_URL } from '@/config/url.config';
import Link from 'next/link';

export const BillingOptionsTable = () => {
  return (
    <Accordion
      type='multiple'
      className='@container w-full min-w-lg overflow-x-hidden'
      defaultValue={['links']}
    >
      <AccordionItem value='links' className='border-none'>
        <div className='billing-accordion-trigger flex w-full items-center justify-between border-b border-neutral-300 dark:border-neutral-500'>
          <AccordionTrigger className='billing-accordion-trigger group cursor-pointer px-5 py-4 text-left hover:no-underline [&[data-state=closed]>svg:last-child]:hidden [&[data-state=open]>svg:last-child]:hidden'>
            <div className='flex items-center gap-x-2'>
              <h4 className='text-base font-medium text-neutral-800 dark:text-neutral-300'>
                Links
              </h4>
              <Icons.arrowDown className='size-5' />
            </div>
          </AccordionTrigger>
          <div className='flex justify-end pr-5'>
            <Link
              target='_blank'
              className='w-fil flex-none cursor-alias text-right text-xs font-medium text-neutral-500 underline decoration-dotted underline-offset-2'
              href={`${BASE_URL}/links`}
            >
              Learn more ↗
            </Link>
          </div>
        </div>

        <AccordionContent className='p-0'>
          <Table
            className='grid grid-cols-4 overflow-hidden text-sm text-neutral-800 max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform [&_strong]:font-medium'
            style={{ '--index': 0 } as React.CSSProperties}
          >
            <TableHeader className='sr-only'>
              <TableRow className='contents'>
                <TableHead>Pro</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Advanced</TableHead>
                <TableHead>Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='contents'>
              {/* Row 1: New Links */}
              <TableRow className='contents bg-white'>
                <TableCell className='flex items-center gap-2 border-b border-neutral-300 px-5 py-4 dark:border-neutral-500'>
                  <Icons.check className='size-4 text-neutral-700 dark:text-neutral-400' />{' '}
                  <span className='text-neutral-500 dark:text-neutral-400'>
                    <strong>1K</strong> new links/mo
                  </span>
                </TableCell>
                <TableCell className='flex items-center gap-2 border-b border-neutral-300 px-5 py-4 dark:border-neutral-500'>
                  <Icons.check className='size-4 text-neutral-700 dark:text-neutral-400' />{' '}
                  <span className='text-neutral-500 dark:text-neutral-400'>
                    <strong>10K</strong> new links/mo
                  </span>
                </TableCell>
                <TableCell className='flex items-center gap-2 border-b border-neutral-300 px-5 py-4 dark:border-neutral-500'>
                  <Icons.check className='size-4 text-neutral-700 dark:text-neutral-400' />{' '}
                  <span className='text-neutral-500 dark:text-neutral-400'>
                    <strong>50K</strong> new links/mo
                  </span>
                </TableCell>
                <TableCell className='flex items-center gap-2 border-b border-neutral-300 px-5 py-4 dark:border-neutral-500'>
                  <Icons.check className='size-4 text-neutral-700 dark:text-neutral-400' />{' '}
                  <span className='text-neutral-500 dark:text-neutral-400'>
                    <strong>Unlimited</strong> new links
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* <div className="overflow-clip transition-opacity">
            
          </div> */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
