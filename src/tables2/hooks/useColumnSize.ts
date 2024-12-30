import { ColumnDef, passiveEventSupported } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { processInitColumnSzie, ColumnSizeMap, processColumnResize, getTableTotalSize } from '../features/columnSize';

export const useColumnSize = <TData, TValue>({
   columns,
   tableWidth,
}: {
   columns: ColumnDef<TData, TValue>[];
   tableWidth?: number;
}) => {
   const [columnSizeMap, setColumnSizeMap] = useState<ColumnSizeMap>();
   const tableTotalSize = getTableTotalSize(columnSizeMap);
   const passiveIfSupported = passiveEventSupported() ? { passive: false } : false;
   const onColumnResize = (_contextDocument?: Document) => {
      const contextDocument = _contextDocument || typeof document !== 'undefined' ? document : null;

      return (event: React.MouseEvent, accessorKey: string) => {
         if (!contextDocument || !columnSizeMap || !tableWidth) return;
         const startX = event.clientX;
         const startSize = columnSizeMap?.get(accessorKey)?.size || 0;
         const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newSize = startSize + deltaX;
            setColumnSizeMap(processColumnResize({ columnSizeMap, accessorKey, newSize, tableWidth }));
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
      setColumnSizeMap(processInitColumnSzie(columns, tableWidth));
   }, [columns, tableWidth]);

   return { columnSizeMap, onColumnResize, tableTotalSize };
};
