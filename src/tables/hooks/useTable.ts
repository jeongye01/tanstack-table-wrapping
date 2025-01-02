import { useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useContainerWidth } from "./useContainerWidth";
import { useColumnSize } from "./useColumnSize";
import { useExtendColumns } from "./useExtendColumns";
import { useDisplayRows } from "./useDisplayRows";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { TableProps } from "../type";
import { useContainerStyle } from "./useContainerStyle";
import { useColumnFilters } from "./useColumnFilter";
import { useColumnGlobalFilter } from "./useColumnGlobalFilter";

export function useTable<TData>({
  data,
  columns: initColumns,
  enableRowIndex,
  option,
  onLoadMore,
  hasMoreData,
}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { size: containerSize } = useContainerWidth({ containerRef });
  const { extentedColumns: columns } = useExtendColumns({
    columns: initColumns,
    enableRowIndex,
  });
  const { columnSizeMap, onColumnResize, tableTotalWidth } = useColumnSize({
    columns,
    tableWidth: containerSize?.width,
  });
  const { columnFilters, onColumnFiltersChange, setColumnFilter } =
    useColumnFilters();
  const { globalFilter, setGlobalFilter } = useColumnGlobalFilter();
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      // Custom Global Filter 로직
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange,
  });

  const { displayRows, tableTotalHeight, isEmptyState } = useDisplayRows({
    // TODO: rows 적을때 동작안하게 하기
    rows: table.getRowModel().rows,
    containerRef,
    rowHeight: option?.rowHeight ?? 46, // FIXME:
  });
  const { bottomRef } = useInfiniteScroll({
    containerRef,
    onLoadMore,
    hasMoreData,
  });
  const { containerStyle } = useContainerStyle(option);

  return {
    table,
    columnSizeMap,
    onColumnResize,
    tableTotalWidth,
    tableTotalHeight,
    displayRows,
    isEmptyState,
    bottomRef,
    containerRef,
    containerStyle,
    setColumnFilter,
    globalFilter,
    setGlobalFilter,
  };
}
