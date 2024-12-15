import {
   flexRender,
   getCoreRowModel,
   getSortedRowModel,
   type SortingState,
   type TableOptions,
   useReactTable,
} from '@tanstack/react-table';

import { type CSSProperties, useState } from 'react';

import { SortingButton } from './Header/SortingButton';
import { useResizableColumns } from './hooks/useResizableColumns';

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

export const Table = <TData,>({ data, columns: initColumns, option }: TableProps<TData>) => {
   const { size } = option || {};
   const [sorting, setSorting] = useState<SortingState>([]);

   const { containerRef, columnSizing } = useResizableColumns({ initColumns });

   const table = useReactTable({
      data,
      columns: initColumns,
      columnResizeMode: 'onChange',
      columnResizeDirection: 'ltr',
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      state: {
         sorting,
         columnSizing,
      },
   });
   console.log(columnSizing);
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
         <table className="dbmaster-table" style={{ opacity: columnSizing ? 1 : 0 }}>
            <thead className="dbmaster-thead">
               {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="dbmaster-tr">
                     {headerGroup.headers.map(header => (
                        <th
                           key={header.id}
                           style={{
                              width: columnSizing?.[header.id],
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
                                    onMouseDown: () => {
                                       console.log(
                                          table.getState().columnSizing,
                                          table.getState().columnSizingInfo.deltaOffset,
                                       );
                                    },

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
                           style={{ width: columnSizing?.[cell.column.id] }}
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
