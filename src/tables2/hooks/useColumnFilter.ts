import { ColumnFiltersState } from '@tanstack/react-table';
import { useState } from 'react';

export const useColumnFilters = <TData>() => {
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: 'status', value: 'Married' }]);
   // TODO: 단일 컬럼 검색, 멀티 컬럼 검색, 종합 컬럼 검색 지원해야 함.

   const resetColumnFilters = () => {
      setColumnFilters([]);
   };
   return { columnFilters, setColumnFilters, resetColumnFilters };
};
