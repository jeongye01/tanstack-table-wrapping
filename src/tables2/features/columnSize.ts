import { ColumnDef } from '@tanstack/react-table';

export const generateColumnSizeMap = <TData, TValue>(
   columns: ColumnDef<TData, TValue>[],
   tableWidth: number,
): Record<string, number> => {
   if (!Array.isArray(columns) || columns.length === 0) return {};

   const staticWidth = columns.reduce((acc, col) => acc + (col.size || 0), 0);
   const dynamicColumnCnt = columns.filter(col => !col.size).length;

   const defaultColumnWidth = dynamicColumnCnt > 0 ? Math.trunc((tableWidth - staticWidth) / dynamicColumnCnt) : 0;

   const lastColumnWidth =
      dynamicColumnCnt > 0 ? tableWidth - staticWidth - defaultColumnWidth * (dynamicColumnCnt - 1) : 0;

   return columns.reduce((acc, col, index) => {
      const isLastDynamicColumn = index === columns.length - 1 || columns.slice(index + 1).every(c => c.size);
      const size = col.size || (isLastDynamicColumn ? lastColumnWidth : defaultColumnWidth);
      if (col.accessorKey) {
         acc[col.accessorKey] = size;
      }
      return acc;
   }, {} as Record<string, number>);
};

export const adjustColumnWidth = ({
   columnSizeMap,
   columnId,
   newSize,
   tableWidth,
}: {
   columnSizeMap: Record<string, number>;
   columnId: string;
   newSize: number;
   tableWidth: number;
}): Record<string, number> | undefined => {
   if (!columnSizeMap || !tableWidth) return undefined;

   const otherColumnsWidth = Object.entries(columnSizeMap)
      .filter(([key]) => key !== columnId)
      .reduce((sum, [, width]) => sum + width, 0);

   const minAllowedWidth = tableWidth || 0;
   const remainingWidth = minAllowedWidth - otherColumnsWidth;

   const adjustedSize = Math.max(newSize, remainingWidth);

   return {
      ...columnSizeMap,
      [columnId]: adjustedSize,
   };
};
