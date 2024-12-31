import { useState } from 'react';
import {
   useReactTable,
   getCoreRowModel,
   getSortedRowModel,
   type TableOptions,
   type SortingState,
} from '@tanstack/react-table';
import { useContainerWidth } from './useContainerWidth';
import { useColumnSize } from './useColumnSize';
import { useExtendColumns } from './useExtendColumns';
import { useDisplayRows } from './useDisplayRows';
import { useInfiniteScroll } from './useInfiniteScroll';

interface UseTableOptions<TData> extends TableOptions<TData> {
   enableRowIndex?: boolean;
   rowHeight: number;
   containerRef: React.RefObject<HTMLDivElement>;
   onLoadMore?: () => void;
   hasMoreData?: boolean;
}

export function useTable<TData>({
   data,
   columns: initColumns,
   enableRowIndex,
   rowHeight,
   containerRef,
   onLoadMore,
   hasMoreData,
}: UseTableOptions<TData>) {
   const [sorting, setSorting] = useState<SortingState>([]);
   const { size: containerSize } = useContainerWidth({ containerRef });
   const { extentedColumns: columns } = useExtendColumns({ columns: initColumns, enableRowIndex });
   const { columnSizeMap, onColumnResize, tableTotalWidth } = useColumnSize({
      columns,
      tableWidth: containerSize?.width,
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

   const { displayRows, tableTotalHeight, isEmptyState } = useDisplayRows({
      rows: table.getRowModel().rows,
      containerRef,
      rowHeight,
   });
   const { bottomRef } = useInfiniteScroll({
      containerRef,
      onLoadMore,
      hasMoreData,
   });
   return {
      table,
      columnSizeMap,
      onColumnResize,
      tableTotalWidth,
      tableTotalHeight,
      displayRows,
      isEmptyState,
      bottomRef,
   };
}
