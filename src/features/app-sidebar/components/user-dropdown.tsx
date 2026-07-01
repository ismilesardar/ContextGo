'use client';

import { CustomPopover } from '@/components/ui/custom-popover';
import { useUserSession } from '@/hooks/use-client-session';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import {
  ComponentPropsWithoutRef,
  ElementType,
  useMemo,
  useState
} from 'react';
import { IconLogout, IconUserCircle } from '@tabler/icons-react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/icons';

export function UserDropdown() {
  const { user } = useUserSession();
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();

  const handelLogOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || 'Something went wrong!');
      return;
    }
    router.push('/auth/login');
  };

  const menuOptions = useMemo(() => {
    const options: Array<{
      label: string;
      icon: any;
      href?: string;
      type?: string;
      onClick?: () => void;
    }> = [
      {
        label: 'Account settings',
        icon: IconUserCircle,
        href: '/account/settings',
        onClick: () => setOpenPopover(false)
      }
    ];

    // Add logout option
    options.push({
      type: 'button',
      label: 'Log out',
      icon: IconLogout,
      onClick: () => handelLogOut()
    });

    return options;
  }, [setOpenPopover]);

  return (
    <CustomPopover
      content={
        <div className='bg-card flex w-full flex-col space-y-px rounded-md p-2 sm:min-w-56 dark:bg-neutral-800'>
          {user ? (
            <div className='px-2 pb-4 sm:pb-2'>
              <p className='truncate text-base font-medium text-neutral-900 sm:text-sm dark:text-neutral-100'>
                {user.name || user.email?.split('@')[0]}
              </p>
              <p className='truncate text-base text-neutral-500 sm:text-sm dark:text-neutral-400'>
                {user.email}
              </p>
            </div>
          ) : (
            <div className='grid gap-2 px-2 py-3'>
              <div className='h-3 w-12 animate-pulse rounded-full bg-neutral-200' />
              <div className='h-3 w-20 animate-pulse rounded-full bg-neutral-200' />
            </div>
          )}
          {menuOptions.map((menuOption, idx) => (
            <UserOption
              key={idx}
              as={menuOption.href ? Link : 'button'}
              {...menuOption}
            />
          ))}
        </div>
      }
      align='start'
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      <button
        onClick={() => setOpenPopover(!openPopover)}
        className={cn(
          'group relative flex size-11 items-center justify-center rounded-lg transition-all',
          'hover:bg-bg-inverted/5 active:bg-bg-inverted/10 data-[state=open]:bg-bg-inverted/10 transition-colors duration-150',
          'outline-none focus-visible:ring-2 focus-visible:ring-black/50'
        )}
      >
        {user ? (
          <Avatar className='size-7 border-none duration-75 sm:size-7'>
            <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
            <AvatarFallback className='rounded-lg'>
              {user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className='size-7 animate-pulse rounded-full bg-neutral-100' />
        )}
      </button>
    </CustomPopover>
  );
}

type UserOptionProps<T extends ElementType> = {
  as?: T;
  label: string;
  icon: Icon;
};

function UserOption<T extends ElementType = 'button'>({
  as,
  label,
  icon: Icon,
  children,
  ...rest
}: UserOptionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof UserOptionProps<T>>) {
  const Component = as ?? 'button';

  return (
    <Component
      className='flex items-center gap-x-4 rounded-md px-2.5 py-1.5 text-base transition-all duration-75 hover:bg-neutral-200/50 active:bg-neutral-200/80 sm:text-sm dark:hover:bg-neutral-200/20'
      {...rest}
    >
      <Icon className='size-5 text-neutral-500 sm:size-4 dark:text-neutral-400' />
      <span className='block truncate text-neutral-600 dark:text-neutral-400'>
        {label}
      </span>
      {children}
    </Component>
  );
}
