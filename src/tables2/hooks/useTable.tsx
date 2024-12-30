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
import { useExtendColumns } from './useExtendColumns';

interface UseTableOptions<TData> extends TableOptions<TData> {
   enableRowIndex?: boolean;
   option?: {
      size?: SizeOption;
   };
}

export function useTable<TData>({ data, columns: initColumns, enableRowIndex, option }: UseTableOptions<TData>) {
   const [sorting, setSorting] = useState<SortingState>([]);
   const { extentedColumns: columns } = useExtendColumns({ columns: initColumns, enableRowIndex });
   const { columnSizeMap, onColumnResize, tableTotalSize } = useColumnSize({
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

   return { table, columnSizeMap, onColumnResize, tableTotalSize };
}
