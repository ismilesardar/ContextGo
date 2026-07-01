'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/table/data-table';
import { WORKSPACE_ROLES } from '@/utils/constants/organization-const';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface MemberTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}
export function MemberTable<TData, TValue>({
  data,
  totalItems,
  columns
}: MemberTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = data.length > 0 ? Math.ceil(totalItems / pageSize) : 0;

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500,
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false
  });

  return (
    <DataTable table={table}>
      <div className='flex justify-between gap-2'>
        <Input
          placeholder='Search name or email...'
          className='w-max'
          value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('user')?.setFilterValue(e.target.value)
          }
        />

        <Select
          onValueChange={(value) =>
            table
              .getColumn('role')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className='w-45'>
            <SelectValue placeholder='Role' />
          </SelectTrigger>
          <SelectContent>
            {WORKSPACE_ROLES.map((org) => (
              <SelectItem key={org.key} value={org.key}>
                {org.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </DataTable>
  );
}
