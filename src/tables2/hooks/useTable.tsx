import { useState } from 'react';
import {
   useReactTable,
   getCoreRowModel,
   getSortedRowModel,
   type TableOptions,
   type SortingState,
} from '@tanstack/react-table';
import { SizeOption } from './useContainerWidth';
import { useColumnSize } from './useColumnSize';

interface UseTableOptions<TData> extends TableOptions<TData> {
   option?: {
      size?: SizeOption;
   };
}

export function useTable<TData>({ data, columns, option }: UseTableOptions<TData>) {
   const [sorting, setSorting] = useState<SortingState>([]);
   const { columnSizeMap, onColumnResize } = useColumnSize({
      columns,
      tableWidth: option?.size?.width,
   });

   const table = useReactTable({
      data,
      columns,
      columnResizeMode: 'onChange',
      columnResizeDirection: 'ltr',
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      state: {
         sorting,
      },
   });

   return { table, columnSizeMap, onColumnResize };
}
