import { ColumnFiltersState } from '@tanstack/react-table';
import { useState } from 'react';

export const useColumnFilters = <TData>() => {
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

   return { columnFilters, setColumnFilters };
};
