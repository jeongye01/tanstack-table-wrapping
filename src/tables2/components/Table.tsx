import { flexRender, type TableOptions } from '@tanstack/react-table';
import { useRef, type CSSProperties } from 'react';
import { SortingButton } from './Header/SortingButton';
import { useContainerWidth } from '../hooks/useContainerWidth';
import { useTable } from '../hooks/useTable';
import { useVirtualizer } from '@tanstack/react-virtual';

interface TableSizeOptions {
   width?: CSSProperties['width'];
   height?: CSSProperties['height'];
   minWidth?: CSSProperties['minWidth'];
   minHeight?: CSSProperties['minHeight'];
   maxWidth?: CSSProperties['maxWidth'];
   maxHeight?: CSSProperties['maxHeight'];
}
interface TableProps<TData> extends Pick<TableOptions<TData>, 'data' | 'columns'> {
   option?: {
      tableSize?: TableSizeOptions;
      rowHeight?: number;
      fontSize?: number;
   };
}

export const Table = <TData,>({ data, columns, option }: TableProps<TData>) => {
   const { tableSize, rowHeight = 46, fontSize = 12 } = option || {};
   const containerRef = useRef<HTMLDivElement>(null);

   // 테이블 크기 계산 및 초기화
   const { size: containerSize } = useContainerWidth({ containerRef });
   const { table, columnSizeMap, onColumnResize } = useTable<TData>({
      data,
      columns,
      option: { size: containerSize },
   });
   const { rows } = table.getRowModel();

   const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => containerRef.current,
      estimateSize: () => rowHeight,
      overscan: 2,
   });

   return (
      <div
         ref={containerRef}
         className="dbmaster-table-container dbmaster-table-scrollbar"
         style={
            {
               height: tableSize?.height ?? '100%',
               minHeight: tableSize?.minHeight,
               maxHeight: tableSize?.maxHeight,
               width: tableSize?.width ?? '100%',
               maxWidth: tableSize?.maxWidth,
               minWidth: tableSize?.minWidth,
               '--dbmaster-row-height': `${rowHeight}px`,
               '--dbmaster-font-size': `${fontSize}px`,
            } as React.CSSProperties
         }
      >
         {
            <table
               className="dbmaster-table"
               style={{
                  height: `${virtualizer.getTotalSize()}px`,
               }}
            >
               <thead className="dbmaster-thead">
                  {table.getHeaderGroups().map(headerGroup => (
                     <tr key={headerGroup.id} className="dbmaster-tr">
                        {columnSizeMap &&
                           headerGroup.headers.map(header => (
                              <th
                                 key={header.id}
                                 style={{
                                    width: columnSizeMap.get(header.id)?.size,
                                    left: columnSizeMap.get(header.id)?.startLeft,
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
                  {virtualizer.getVirtualItems().map((virtualRow, index) => {
                     const row = rows[virtualRow.index];
                     return (
                        <tr
                           key={row.id}
                           className="dbmaster-tr"
                           style={{
                              height: `${virtualRow.size}px`,
                              transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                           }}
                        >
                           {columnSizeMap &&
                              row.getVisibleCells().map(cell => (
                                 <td
                                    className="dbmaster-td"
                                    key={cell.id}
                                    data-column-id={cell.id}
                                    style={{
                                       width: columnSizeMap.get(cell.column.id)?.size,
                                       left: columnSizeMap.get(cell.column.id)?.startLeft,
                                    }}
                                 >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </td>
                              ))}
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         }
      </div>
   );
};
