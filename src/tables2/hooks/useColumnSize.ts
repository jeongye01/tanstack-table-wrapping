import { ColumnDef, passiveEventSupported } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { generateColumnSizeMap, adjustColumnWidth } from '../features/columnSize';

type ColumnSizeMap = Record<string, number>;
export const useColumnSize = <TData, TValue>({
   columns,
   tableWidth,
}: {
   columns: ColumnDef<TData, TValue>[];
   tableWidth?: number;
}) => {
   const [columnSizeMap, setColumnSizeMap] = useState<ColumnSizeMap>();
   const passiveIfSupported = passiveEventSupported() ? { passive: false } : false;
   const onColumnResize = (_contextDocument?: Document) => {
      const contextDocument = _contextDocument || typeof document !== 'undefined' ? document : null;

      return (event: React.MouseEvent, columnId: string) => {
         if (!contextDocument || !columnSizeMap || !tableWidth) return;
         const startX = event.clientX;
         const startSize = columnSizeMap[columnId];

         const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newSize = startSize + deltaX;
            const updatedSizeMap = adjustColumnWidth({ columnSizeMap, columnId, newSize, tableWidth });

            if (updatedSizeMap) {
               setColumnSizeMap(updatedSizeMap);
            }
         };
         const handleMouseUp = () => {
            contextDocument.removeEventListener('mousemove', handleMouseMove);
            contextDocument.removeEventListener('mouseup', handleMouseUp);
         };

         contextDocument.addEventListener('mousemove', handleMouseMove, passiveIfSupported);
         contextDocument.addEventListener('mouseup', handleMouseUp, passiveIfSupported);
      };
   };
   useEffect(() => {
      if (!tableWidth) return;
      setColumnSizeMap(generateColumnSizeMap(columns, tableWidth));
   }, [columns, tableWidth]);

   return { columnSizeMap, onColumnResize };
};
