import { Skeleton } from '@/components/ui/skeleton';

export function AgentProfileDetailSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-6 w-40' />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-16 w-full rounded-lg' />
        ))}
      </div>
    </div>
  );
}
