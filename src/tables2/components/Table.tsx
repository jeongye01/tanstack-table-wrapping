import { flexRender, type TableOptions } from '@tanstack/react-table';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

import { SortingButton } from './Header/SortingButton';
import { useContainerWidth } from '../hooks/useContainerWidth';
import { useTable } from '../hooks/useTable';

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

export const Table = <TData,>({ data, columns, option }: TableProps<TData>) => {
   const { size } = option || {};
   const containerRef = useRef<HTMLDivElement>(null);
   const { size: tableSize } = useContainerWidth({ containerRef });
   const { table, columnSizeMap, onColumnResize, columnStartMap } = useTable<TData>({
      data,
      columns,
      option: { size: tableSize },
   });
   console.log(columnStartMap);
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
         {columnSizeMap && (
            <table className="dbmaster-table">
               <thead className="dbmaster-thead">
                  {table.getHeaderGroups().map(headerGroup => (
                     <tr key={headerGroup.id} className="dbmaster-tr">
                        {headerGroup.headers.map(header => (
                           <th
                              key={header.id}
                              style={{
                                 width: columnSizeMap?.[header.id],
                                 left: columnStartMap?.[header.id],
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
                                       onMouseDown: event => onColumnResize()(event, header.id),
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
                              className="dbmaster-td"
                              key={cell.id}
                              data-column-id={cell.id}
                              style={{
                                 width: columnSizeMap?.[cell.id],
                                 left: columnStartMap?.[cell.column.id],
                              }}
                           >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};
