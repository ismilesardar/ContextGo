'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MemberRow } from '../members-view-page';
import { CellAction } from './cell-action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<MemberRow>[] = [
  {
    id: 'user',
    accessorKey: 'user.name',
    header: 'User',
    enableColumnFilter: true,
    accessorFn: (row) => row.user,
    cell: ({ row }) => {
      const user = row.original.user;

      return (
        <div className='flex items-center gap-2'>
          <Avatar className='size-8 rounded-full'>
            <AvatarImage src={user?.image || ''} alt={user?.name || ''} />

            <AvatarFallback className='rounded-lg'>
              {user?.email?.[0].toLocaleUpperCase() ||
                row.original?.email?.[0].toLocaleUpperCase() ||
                '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{user?.name}</div>
            <div className='text-muted-foreground text-xs'>
              {user?.email || row.original?.email}
            </div>
            {!user?.image && (
              <Badge
                variant='secondary'
                className='mt-1 rounded-2xl bg-amber-600'
              >
                {row.original?.status}
              </Badge>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const user = row.original.user;
      const v = Array.isArray(value)
        ? value.join(' ').toLowerCase()
        : String(value ?? '').toLowerCase();
      return (
        user?.name?.toLowerCase().includes(v) ||
        user?.email?.toLowerCase().includes(v) ||
        false
      );
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    size: 55,
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
