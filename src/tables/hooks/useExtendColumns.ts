import { ColumnDef } from '@tanstack/react-table';
import { RowIndexColumn } from '../components/Column/RowIndexColumn';

export const useExtendColumns = ({ columns, enableRowIndex }: { columns: ColumnDef; enableRowIndex?: boolean }) => {
   const extentedColumns = enableRowIndex ? [RowIndexColumn, ...columns] : columns;
   return { extentedColumns };
};
