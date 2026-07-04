import { Skeleton } from '@/components/ui/skeleton';

export function ChecklistDetailSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]'>
      <div className='space-y-4'>
        <Skeleton className='h-8 w-2/3' />
        <Skeleton className='h-64 w-full rounded-lg' />
      </div>
      <div className='space-y-3'>
        <Skeleton className='h-24 w-full rounded-lg' />
        <Skeleton className='h-24 w-full rounded-lg' />
      </div>
    </div>
  );
}
