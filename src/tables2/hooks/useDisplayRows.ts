import { useVirtualizer } from '@tanstack/react-virtual';

export const useDisplayRows = ({ rows, containerRef, rowHeight }: any) => {
   const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => containerRef.current,
      estimateSize: () => rowHeight,
      overscan: 2,
   });
   const displayRows = virtualizer.getVirtualItems().map((virtualRow, index) => ({
      virtualRow,
      index,
      row: rows[virtualRow.index],
   }));
   const tableTotalHeight = virtualizer.getTotalSize();
   const isEmptyState = rows.length === 0;
   return { displayRows, tableTotalHeight, isEmptyState };
};
