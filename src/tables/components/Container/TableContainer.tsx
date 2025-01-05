import { useTableContext } from '../../tableContext';
import { TableHeader } from '../Header/TableHeader';
import { TableBody } from '../Body/TableBody';
import clsx from 'clsx';

export const TableContainer = () => {
   const { bottomRef, containerRef, tableStyle, tableClassName, tableTotalHeight, tableTotalWidth } = useTableContext();
   return (
      <div
         ref={containerRef}
         className={clsx(tableClassName, 'dbmaster-table-container dbmaster-table-scrollbar')}
         style={tableStyle}
      >
         <table
            className="dbmaster-table"
            style={{
               height: tableTotalHeight,
               width: tableTotalWidth,
            }}
         >
            <TableHeader />
            <TableBody />
         </table>
         <div ref={bottomRef} style={{ height: '3px', width: '100%', background: 'transparent' }} />
      </div>
   );
};
