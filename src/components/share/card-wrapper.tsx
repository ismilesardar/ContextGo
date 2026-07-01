'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface CardWrapperProps {
  headerLabel: string;
  children: React.ReactNode;
}

export const CardWrapper = ({ headerLabel, children }: CardWrapperProps) => {
  return (
    <Card className='w-full border-none bg-transparent shadow-none md:w-[450px]'>
      <CardHeader>
        <CardTitle className='text-center text-xl font-semibold'>
          {headerLabel}
        </CardTitle>
      </CardHeader>

      <CardContent className='mt-7'>{children}</CardContent>
    </Card>
  );
};
