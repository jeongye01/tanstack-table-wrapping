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
import { useResizableColumns } from './hooks/useResizableColumns';
export function passiveEventSupported() {
   let supported = false;
   try {
      const options = {
         get passive() {
            supported = true;
            return false;
         },
      };

      const noop = () => {};

      window.addEventListener('test', noop, options);
      window.removeEventListener('test', noop);
   } catch {
      supported = false;
   }

   return supported;
}

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

   const { containerRef, columns, containerWidth, columnSizeMap, setColumnSizeMap } = useResizableColumns({
      initColumns,
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

   const handleResize = (columnId: string, newSize: number) => {
      console.log(newSize, columnId);
      setColumnSizeMap({
         ...columnSizeMap,
         [columnId]: newSize,
      });
   };
   console.log(columnSizeMap);

   const columnResizeHandler = (_contextDocument?: Document) => {
      const contextDocument = _contextDocument || typeof document !== 'undefined' ? document : null;

      return (event: React.MouseEvent, columnId: string) => {
         const startX = event.clientX; // 초기 마우스 X 위치
         const startSize = columnSizeMap[columnId]; // 초기 열 크기

         const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaPercentage = Math.max(deltaX / startSize, -0.999999);
            const newSize = Math.round(Math.max(startSize + startSize * deltaPercentage, 0) * 100) / 100;
            handleResize(columnId, newSize);
         };
         const handleMouseUp = () => {
            contextDocument?.removeEventListener('mousemove', handleMouseMove);
            contextDocument?.removeEventListener('mouseup', handleMouseUp);
         };
         const passiveIfSupported = passiveEventSupported() ? { passive: false } : false;

         contextDocument?.addEventListener('mousemove', handleMouseMove, passiveIfSupported);
         contextDocument?.addEventListener('mouseup', handleMouseUp, passiveIfSupported);
      };
   };
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
         <table className="dbmaster-table" style={{ opacity: containerWidth ? 1 : 0 }}>
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
                                    onMouseDown: event => columnResizeHandler()(event, header.id), // 반환된 핸들러 호출
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
                           style={{ width: columnSizeMap?.[cell.column.id] }}
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
