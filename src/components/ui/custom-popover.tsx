'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { PropsWithChildren, ReactNode, WheelEventHandler } from 'react';
import { Drawer } from 'vaul';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export type PopoverProps = PropsWithChildren<{
  content: ReactNode | string;
  align?: 'center' | 'start' | 'end';
  side?: 'bottom' | 'top' | 'left' | 'right';
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
  mobileOnly?: boolean;
  forceDropdown?: boolean;
  popoverContentClassName?: string;
  onOpenAutoFocus?: PopoverPrimitive.PopoverContentProps['onOpenAutoFocus'];
  collisionBoundary?: Element | Element[];
  sticky?: 'partial' | 'always';
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onWheel?: WheelEventHandler;
  sideOffset?: number;
}>;

export function CustomPopover({
  children,
  content,
  align = 'center',
  side = 'bottom',
  openPopover,
  setOpenPopover,
  mobileOnly,
  forceDropdown,
  popoverContentClassName,
  onOpenAutoFocus,
  collisionBoundary,
  sticky,
  onEscapeKeyDown,
  onWheel,
  sideOffset = 8
}: PopoverProps) {
  const isMobile = useIsMobile();

  if (!forceDropdown && (mobileOnly || isMobile)) {
    return (
      <Drawer.Root open={openPopover} onOpenChange={setOpenPopover}>
        <Drawer.Trigger className='' asChild>
          {children}
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className='bg-bg-subtle bg-opacity-10 fixed inset-0 z-50 backdrop-blur' />
          <Drawer.Content
            className='bg-card fixed right-0 bottom-0 left-0 z-50 mt-24 rounded-t-[10px] border-t border-neutral-100/60 dark:bg-neutral-800'
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={(e) => {
              // Prevent dismissal when clicking inside a toast
              if (
                e.target instanceof Element &&
                e.target.closest('[data-sonner-toast]')
              ) {
                e.preventDefault();
              }
            }}
          >
            <VisuallyHidden.Root>
              <Drawer.Title>Modal</Drawer.Title>
              <Drawer.Description>This is a modal</Drawer.Description>
            </VisuallyHidden.Root>
            <div className='bg-card sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] dark:bg-neutral-800'>
              <div className='my-3 h-1 w-12 rounded-full bg-neutral-300 dark:bg-neutral-500' />
            </div>
            <div className='bg-card flex w-full items-center justify-center overflow-hidden align-middle dark:bg-neutral-800'>
              {content}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverPrimitive.Trigger className='sm:inline-flex' asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={sideOffset}
          align={align}
          side={side}
          className={cn(
            'animate-slide-up-fade border-card bg-card z-50 items-center rounded-lg border drop-shadow-lg sm:block',
            popoverContentClassName
          )}
          sticky={sticky}
          collisionBoundary={collisionBoundary}
          onOpenAutoFocus={onOpenAutoFocus}
          onEscapeKeyDown={onEscapeKeyDown}
          onWheel={onWheel}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
