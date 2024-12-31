import { flexRender } from '@tanstack/react-table';
import { useTableContext } from '../../tableContext';

export const Row = ({ virtualRow, index, row }) => {
   const { columnSizeMap } = useTableContext();
   return (
      <tr
         key={row.id}
         className="dbmaster-tr"
         style={{
            transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
         }}
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
