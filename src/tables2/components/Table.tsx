import { flexRender, type TableOptions } from '@tanstack/react-table';
import { useRef, type CSSProperties } from 'react';
import { SortingButton } from './Header/SortingButton';
import { useContainerWidth } from '../hooks/useContainerWidth';
import { useTable } from '../hooks/useTable';
import { useVirtualizer } from '@tanstack/react-virtual';
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
      rowHeight?: number; // 행 높이 추가
   };
}

export const Table = <TData,>({ data, columns, option }: TableProps<TData>) => {
   const { size, rowHeight = 46 } = option || {};
   const containerRef = useRef<HTMLDivElement>(null);

   // 테이블 크기 계산 및 초기화
   const { size: containerSize } = useContainerWidth({ containerRef });
   const { table, columnSizeMap, onColumnResize, columnStartMap } = useTable<TData>({
      data,
      columns,
      option: { size: containerSize },
   });
   const { rows } = table.getRowModel();

   const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => containerRef.current,
      estimateSize: () => 46,
      overscan: 2,
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
            overflowY: 'auto',
            position: 'relative',
         }}
      >
         {
            <table className="dbmaster-table" style={{ height: `${virtualizer.getTotalSize()}px` }}>
               <thead className="dbmaster-thead">
                  {table.getHeaderGroups().map(headerGroup => (
                     <tr key={headerGroup.id} className="dbmaster-tr">
                        {columnSizeMap &&
                           headerGroup.headers.map(header => (
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
                                       width: columnSizeMap?.[cell.column.id],
                                       left: columnStartMap?.[cell.column.id],
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
