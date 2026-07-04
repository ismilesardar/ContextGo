import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function InstructionCardSkeleton() {
  return (
    <Card className='gap-3 rounded-lg'>
      <CardHeader className='flex flex-row items-start gap-3'>
        <Skeleton className='size-9 shrink-0 rounded-md' />
        <div className='min-w-0 flex-1 space-y-2'>
          <Skeleton className='h-4 w-2/3' />
          <Skeleton className='h-3 w-full' />
        </div>
      </CardHeader>
      <CardContent className='flex items-center justify-between'>
        <Skeleton className='h-5 w-16 rounded-full' />
        <Skeleton className='h-3 w-24' />
      </CardContent>
    </Card>
  );
}
