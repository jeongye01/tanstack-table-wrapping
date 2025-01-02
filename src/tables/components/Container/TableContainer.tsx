import { useTableContext } from '../../tableContext';
import { TableHeader } from '../Header/TableHeader';
import { TableBody } from '../Body/TableBody';

export const TableContainer = () => {
   const { bottomRef, containerRef, containerStyle, tableTotalHeight, tableTotalWidth } = useTableContext();
   return (
      <div ref={containerRef} className="dbmaster-table-container dbmaster-table-scrollbar" style={containerStyle}>
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
