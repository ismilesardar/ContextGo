import type { Icons } from '@/components/icons';
import { Icons as IconSet } from '@/components/icons';

export function PlaceholderTab({
  icon,
  title,
  description
}: {
  icon: keyof typeof Icons;
  title: string;
  description: string;
}) {
  const Icon = IconSet[icon];

  return (
    <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
      <div className='mb-1 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800'>
        <Icon className='text-muted-foreground size-6' />
      </div>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <p className='text-muted-foreground max-w-md text-sm'>{description}</p>
      <p className='text-muted-foreground text-xs'>Coming soon</p>
    </div>
  );
}
