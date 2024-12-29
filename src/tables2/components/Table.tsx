import { flexRender, type TableOptions } from '@tanstack/react-table';

import { type CSSProperties } from 'react';

import { SortingButton } from './Header/SortingButton';
import { useResizableContainer } from '../hooks/useContainerWidth';
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

export const Table = <TData,>({ data, columns: initColumns, option }: TableProps<TData>) => {
   const { size } = option || {};
   const { containerRef, size: tableSize } = useResizableContainer();
   const { table, columnSizeMap, onColumnResize } = useTable({
      data,
      columns: initColumns,
      option: { size: tableSize },
   });
   console.log(columnSizeMap);

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
                              key={cell.id}
                              data-column-id={cell.id}
                              style={{ width: columnSizeMap?.[cell.id] }}
                              className="dbmaster-td"
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
