import {
   flexRender,
   getCoreRowModel,
   getSortedRowModel,
   type SortingState,
   type TableOptions,
   useReactTable,
} from '@tanstack/react-table';

import { type CSSProperties, useEffect, useRef, useState } from 'react';

import { SortingButton } from './Header/SortingButton';

interface TableProps<TData> extends Pick<TableOptions<TData>, 'data' | 'columns'> {
   option?: {
      size?: {
         width?: CSSProperties['width'];
         height?: CSSProperties['height'];
         minWidth?: CSSProperties['minWidth'];
         minHeight?: CSSProperties['minHeight'];
         maxWidth?: CSSProperties['maxWidth'];
         maxHeight?: CSSProperties['maxHeight'];
      };
   };
}

export const Table = <TData,>({ data, columns: rawColumns, option }: TableProps<TData>) => {
   const { size } = option || {};
   const [sorting, setSorting] = useState<SortingState>([]);
   const [columns, setColumns] = useState(rawColumns);

   const containerRef = useRef<HTMLDivElement>(null);
   const [width, setWidth] = useState<number>();

   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new ResizeObserver(entries => {
         for (const entry of entries) {
            if (entry.contentRect) {
               const totalWidth = entry.contentRect.width;

               const dynamicColumns = rawColumns.filter(col => !col.size).length;
               const staticWidth = columns.reduce((acc, col) => acc + (col.size || 0), 0);
               const defaultColumnWidth =
                  dynamicColumns > 0 ? Math.trunc((totalWidth - staticWidth) / dynamicColumns) : 0;
               const lastColumnWidth = totalWidth - staticWidth - defaultColumnWidth * (dynamicColumns - 1);
               let left = dynamicColumns;
               setColumns(
                  rawColumns.map(col => {
                     if (col.size) {
                        return col;
                     }
                     left--;
                     return {
                        ...col,
                        size: left === 1 ? lastColumnWidth : defaultColumnWidth,
                     };
                  }),
               );
               setWidth(totalWidth);
            }
         }
      });
      observer.observe(container);
      return () => {
         observer.disconnect();
      };
   }, []);

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

   return (
      <div
         ref={containerRef}
         className="dbmaster-table-container dbmaster-table-scrollbar"
         style={{
            height: size?.height ?? '100%',
            minHeight: size?.minHeight,
            maxHeight: size?.maxHeight,
            width: size?.width ?? '100%',
            maxWidth: size?.maxWidth,
            minWidth: size?.minWidth,
         }}
      >
         <table className="dbmaster-table" style={{ opacity: width ? 1 : 0 }}>
            <thead className="dbmaster-thead">
               {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="dbmaster-tr">
                     {headerGroup.headers.map(header => (
                        <th
                           key={header.id}
                           style={{
                              width: header.getSize(),
                           }}
                           data-column-id={header.id}
                           className="dbmaster-th"
                        >
                           {flexRender(header.column.columnDef.header, header.getContext())}
                           {header.column.getCanSort() && (
                              <SortingButton
                                 sortDirection={header.column.getIsSorted() || undefined}
                                 onClick={() => header.column.toggleSorting()}
                              />
                           )}
                           {header.column.getCanResize() && (
                              <div
                                 {...{
                                    onDoubleClick: () => header.column.resetSize(),
                                    onMouseDown: header.getResizeHandler(),
                                    onTouchStart: header.getResizeHandler(),
                                    className: `
                                       dbmaster-column-resizer-bar
                                       ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                                 }}
                              />
                           )}
                        </th>
                     ))}
                  </tr>
               ))}
            </thead>
            <tbody className="dbmaster-tbody">
               {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="dbmaster-tr">
                     {row.getVisibleCells().map(cell => (
                        <td
                           key={cell.id}
                           data-column-id={cell.id}
                           style={{ width: cell.column.getSize() }}
                           className="dbmaster-td"
                        >
                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                     ))}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
