import { TableOptions } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';

interface UseResizableColumnsOptions<TColumn> {
   initColumns: TableOptions<TColumn>['columns'];
}

export function useResizableColumns<TColumn>({ initColumns }: UseResizableColumnsOptions<TColumn>) {
   const [columnSizing, setColumnSizing] = useState<Record<string, number>>();

   const containerRef = useRef<HTMLDivElement>(null);
   const [containerWidth, setContainerWidth] = useState<number>();

   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new ResizeObserver(entries => {
         for (const entry of entries) {
            if (entry.contentRect) {
               const totalWidth = entry.contentRect.width;
               const dynamicColumns = initColumns.filter(col => !col.size).length;
               const staticWidth = initColumns.reduce((acc, col) => acc + (col.size || 0), 0);
               const defaultColumnWidth =
                  dynamicColumns > 0 ? Math.trunc((totalWidth - staticWidth) / dynamicColumns) : 0;
               const lastColumnWidth = totalWidth - staticWidth - defaultColumnWidth * (dynamicColumns - 1);
               let left = dynamicColumns; // FIXME: 안티패턴

               const newColumnSizing = initColumns.reduce((acc, col) => {
                  if (col.size) {
                     acc[col.accessorKey!] = col.size;
                  } else {
                     left--;
                     acc[col.accessorKey!] = left === 1 ? lastColumnWidth : defaultColumnWidth;
                  }
                  return acc;
               }, {} as Record<string, number>);
               console.log(newColumnSizing);
               setColumnSizing(newColumnSizing);
               setContainerWidth(totalWidth);
            }
         }
      });
      observer.observe(container);
      return () => {
         observer.disconnect();
      };
   }, []);
   const handleColumnResize = (columnId: string, deltaX: number) => {
      setColumnSizing(prevSizing => {
         const newSizing = { ...prevSizing };
         const newWidth = Math.max((newSizing[columnId] || 0) + deltaX, 50); // 최소 너비 50px
         newSizing[columnId] = newWidth;
         return newSizing;
      });
   };
   return { containerRef, containerWidth, columnSizing, handleColumnResize };
}
