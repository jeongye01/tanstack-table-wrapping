import { ColumnDef } from '@tanstack/react-table';
import { pipe } from '../utils/pipe';
interface ColumnSizeInfo {
   // TODO: 타입 tanstack-table거 쓰기
   size: number;
   startSize?: number;
   startLeft?: number;
}
export type ColumnSizeMap = Map<string, ColumnSizeInfo>;
function clampColumnSize(size: number, minSize: number = 80): number {
   return Math.max(size, minSize);
}

const generateColumnSizeMap = <TData, TValue>(
   columns: ColumnDef<TData, TValue>[],
   tableWidth: number,
): ColumnSizeMap => {
   if (!Array.isArray(columns) || columns.length === 0) return new Map();

   const staticWidth = columns.reduce((acc, col) => acc + (col.size || 0), 0);
   const dynamicColumnCnt = columns.filter(col => !col.size).length;

   const defaultColumnWidth = dynamicColumnCnt > 0 ? Math.trunc((tableWidth - staticWidth) / dynamicColumnCnt) : 0;

   const lastColumnWidth =
      dynamicColumnCnt > 0 ? tableWidth - staticWidth - defaultColumnWidth * (dynamicColumnCnt - 1) : 0;

   return columns.reduce((acc, col, index) => {
      const isLastDynamicColumn = index === columns.length - 1 || columns.slice(index + 1).every(c => c.size);
      const size = col.size || clampColumnSize(isLastDynamicColumn ? lastColumnWidth : defaultColumnWidth);

      if (col.accessorKey) {
         acc.set(col.accessorKey, {
            size,
            startSize: size,
         });
      }
      return acc;
   }, new Map<string, ColumnSizeInfo>());
};

const adjustColumnWidth = ({
   columnSizeMap,
   accessorKey,
   newSize,
   tableWidth,
}: {
   columnSizeMap: ColumnSizeMap;
   accessorKey: string;
   newSize: number;
   tableWidth: number;
}): ColumnSizeMap => {
   if (!columnSizeMap || !tableWidth) return columnSizeMap;
   const targetColumn = columnSizeMap.get(accessorKey);
   if (!targetColumn) return columnSizeMap;

   targetColumn.size = clampColumnSize(newSize, targetColumn.startSize);

   const newMap = new Map(columnSizeMap);

   newMap.set(accessorKey, targetColumn);

   return newMap;
};
const generateColumnStart = (columnSizeMap: ColumnSizeMap): ColumnSizeMap => {
   if (!columnSizeMap) return columnSizeMap;
   return Array.from(columnSizeMap.entries()).reduce(
      (acc, [key, info]) => {
         const { size } = info;

         const cumulativeStart = acc.cumulativeStart;
         acc.updatedMap.set(key, {
            ...info,
            startLeft: cumulativeStart,
         });
         acc.cumulativeStart += size;

         return acc;
      },
      { updatedMap: new Map<string, ColumnSizeInfo>(), cumulativeStart: 0 },
   ).updatedMap;
};
export const processInitColumnSzie = <TData, TValue>(
   columns: ColumnDef<TData, TValue>[],
   tableWidth: number,
): ColumnSizeMap => {
   const pipeline = pipe(
      (columns: ColumnDef<TData, TValue>[]) => generateColumnSizeMap(columns, tableWidth),
      generateColumnStart,
   );
   return pipeline(columns);
};
export const processColumnResize = ({
   columnSizeMap,
   accessorKey,
   newSize,
   tableWidth,
}: {
   columnSizeMap: ColumnSizeMap;
   accessorKey: string;
   newSize: number;
   tableWidth: number;
}): ColumnSizeMap => {
   const pipeline = pipe(
      columnSizeMap => adjustColumnWidth({ columnSizeMap, accessorKey, newSize, tableWidth }),
      generateColumnStart,
   );
   return pipeline(columnSizeMap);
};
