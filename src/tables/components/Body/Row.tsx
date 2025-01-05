import { flexRender } from '@tanstack/react-table';
import { useTableContext } from '../../tableContext';
import clsx from 'clsx';

export const Row = ({ virtualRow, index, row }) => {
   const { columnSizeMap, customRowOptions } = useTableContext();
   const rowClassName = customRowOptions?.rowClassName?.({ rowId: row.id, rowData: row.original }) || '';
   const rowStyle = customRowOptions?.rowStyle?.({ rowId: row.id, rowData: row.original }) || {};
   const rowEvents = customRowOptions?.rowEvent?.({ rowId: row.id, rowData: row.original }) || {};
   return (
      <tr
         key={row.id}
         className={clsx('dbmaster-tr', rowClassName)}
         style={{
            ...rowStyle,
            transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
         }}
         {...rowEvents}
      >
         {columnSizeMap &&
            row.getVisibleCells().map(cell => (
               <td
                  className="dbmaster-td"
                  key={cell.id}
                  data-column-id={cell.id}
                  style={{
                     width: columnSizeMap.get(cell.column.id)?.size,
                     left: columnSizeMap.get(cell.column.id)?.startLeft,
                  }}
               >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
               </td>
            ))}
      </tr>
   );
};
