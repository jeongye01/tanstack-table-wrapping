import React, { createContext, useContext } from 'react';

interface TableContextType {
   table: any; // tanstack Table 객체
   columnSizeMap: Map<string, any>; // 컬럼 크기 정보
   onColumnResize: (event: React.MouseEvent, columnId: string) => void; // 컬럼 리사이즈 핸들러
   tableTotalWidth: number; // 테이블 총 너비
   tableTotalHeight: number; // 테이블 총 높이
   displayRows: any[]; // 가상화된 행 데이터
   isEmptyState: boolean;
   bottomRef: React.RefObject<HTMLDivElement>;
}

const TableContext = createContext<TableContextType | null>(null);

export const useTableContext = (): TableContextType => {
   const context = useContext(TableContext);
   if (!context) {
      throw new Error('useTableContext must be used within a TableProvider');
   }
   return context;
};

export const TableProvider = ({ children, value }: { children: React.ReactNode; value: TableContextType }) => {
   return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};
