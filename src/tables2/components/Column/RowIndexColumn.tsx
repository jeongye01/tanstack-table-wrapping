export const RowIndexColumn = {
   accessorKey: 'no',
   header: 'No',
   cell: info => info.row.index + 1,
   enableResizing: false,
   enableSorting: false,
   size: 80,
};
