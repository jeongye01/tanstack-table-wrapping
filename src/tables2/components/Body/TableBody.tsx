import { useTableContext } from '../../tableContext';
import { Row } from './Row';
import { TableEmptyState } from './TableEmptyState';

export const TableBody = () => {
   const { displayRows, isEmptyState } = useTableContext();

   if (isEmptyState) return <TableEmptyState />;

   return (
      <tbody className="dbmaster-tbody">
         {displayRows.map(({ virtualRow, row, index }) => (
            <Row key={row.id} virtualRow={virtualRow} row={row} index={index} />
         ))}
      </tbody>
   );
};
