import { type TableOptions } from '@tanstack/react-table';
import { useRef, type CSSProperties } from 'react';
import { useTable } from '../hooks/useTable';
import { TableProvider } from '../tableContext';
import { TableHeader } from './Header/TableHeader';
import { TableBody } from './Body/TableBody';
import { TableContainer } from './Container/TableContainer';

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
   onLoadMore?: () => void;
   hasMoreData?: boolean;
   option?: {
      // size 옵션으로 바꿔야 하나
      tableSize?: TableSizeOptions;
      rowHeight?: number;
      fontSize?: number;
   };
}

export const Table = <TData,>({
   data,
   columns,
   option,
   enableRowIndex,
   onLoadMore,
   hasMoreData,
}: TableProps<TData>) => {
   const { tableSize, rowHeight = 46, fontSize = 12 } = option || {};
   const containerRef = useRef<HTMLDivElement>(null);
   const table = useTable<TData>({
      data,
      columns,
      rowHeight,
      enableRowIndex,
      containerRef,
      onLoadMore,
      hasMoreData,
   });
   return (
      <TableProvider
         value={{
            ...table,
         }}
      >
         <TableContainer
            containerRef={containerRef}
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
         </TableContainer>
      </TableProvider>
   );
};
