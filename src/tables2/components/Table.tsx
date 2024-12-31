import { type TableOptions } from '@tanstack/react-table';
import { useRef, type CSSProperties } from 'react';
import { useTable } from '../hooks/useTable';
import { TableProvider } from '../tableContext';
import { TableHeader } from './Header/TableHeader';
import { TableBody } from './Body/TableBody';

interface TableSizeOptions {
   width?: CSSProperties['width'];
   height?: CSSProperties['height'];
   minWidth?: CSSProperties['minWidth'];
   minHeight?: CSSProperties['minHeight'];
   maxWidth?: CSSProperties['maxWidth'];
   maxHeight?: CSSProperties['maxHeight'];
}
interface TableProps<TData> extends Pick<TableOptions<TData>, 'data' | 'columns'> {
   enableRowIndex?: boolean;
   option?: {
      // size 옵션으로 바꿔야 하나
      tableSize?: TableSizeOptions;
      rowHeight?: number;
      fontSize?: number;
   };
}

export const Table = <TData,>({ data, columns, option, enableRowIndex }: TableProps<TData>) => {
   const { tableSize, rowHeight = 46, fontSize = 12 } = option || {};
   const containerRef = useRef<HTMLDivElement>(null);
   const table = useTable<TData>({
      data,
      columns,
      rowHeight,
      enableRowIndex,
      containerRef,
   });
   return (
      <TableProvider
         value={{
            ...table,
         }}
      >
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
            <table
               className="dbmaster-table"
               style={{
                  height: table.tableTotalHeight,
                  width: table.tableTotalWidth,
               }}
            >
               <TableHeader />
               <TableBody />
            </table>
         </div>
      </TableProvider>
   );
};
