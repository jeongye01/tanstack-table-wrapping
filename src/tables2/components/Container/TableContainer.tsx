import React from 'react';
import { useTableContext } from '../../tableContext';

export const TableContainer = ({
   containerRef,
   children,
   style,
}: {
   containerRef: React.RefObject<HTMLDivElement>;
   children: React.ReactNode;
   style: React.CSSProperties;
}) => {
   const { bottomRef } = useTableContext();
   return (
      <div ref={containerRef} className="dbmaster-table-container dbmaster-table-scrollbar" style={style}>
         {children}
         <div ref={bottomRef} style={{ height: '3px', width: '100%', background: 'transparent' }}></div>
         asdf
      </div>
   );
};
