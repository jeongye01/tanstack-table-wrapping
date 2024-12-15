import { TableOptions } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';

interface UseResizableColumnsOptions<TColumn> {
   initColumns: TableOptions<TColumn>['columns'];
}

export function useResizableColumns<TColumn>({ initColumns }: UseResizableColumnsOptions<TColumn>) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [containerWidth, setContainerWidth] = useState<number>();
   const [columns, setColumns] = useState(initColumns);
   const [columnSizeMap, setColumnSizeMap] = useState<Record<string, number>>({});

   useEffect(() => {
      const container = containerRef.current;

      if (!container) return;

      const observer = new ResizeObserver(entries => {
         for (const entry of entries) {
            if (entry.contentRect) {
               const totalWidth = entry.contentRect.width;
               const dynamicColumns = initColumns.filter(col => !col.size).length;
               const staticWidth = columns.reduce((acc, col) => acc + (col.size || 0), 0);
               const defaultColumnWidth =
                  dynamicColumns > 0 ? Math.trunc((totalWidth - staticWidth) / dynamicColumns) : 0;
               const lastColumnWidth = totalWidth - staticWidth - defaultColumnWidth * (dynamicColumns - 1);
               let left = dynamicColumns; // FIXME: 안티패턴

               const newColumns = initColumns.map(col => {
                  if (col.size) {
                     return col;
                  }
                  left--;
                  return {
                     ...col,
                     size: left === 1 ? lastColumnWidth : defaultColumnWidth,
                  };
               });
               setColumns(newColumns);
               const sizeMap = newColumns.reduce((acc, column) => {
                  const key = column.accessorKey; // id 또는 accessorKey 사용
                  if (key && column.size !== undefined) {
                     acc[key] = column.size;
                  }
                  return acc;
               }, {} as Record<string, number>);
               setColumnSizeMap(sizeMap); // 상태 업데이트
               setContainerWidth(totalWidth);
            }
         }
      });
      observer.observe(container);
      return () => {
         observer.disconnect();
      };
   }, []);

   return { containerRef, containerWidth, columns, columnSizeMap, setColumnSizeMap };
}
