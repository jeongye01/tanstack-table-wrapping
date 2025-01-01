import React, { createContext, useContext } from 'react';

// TODO: table layout 관련 context 쪼개기
interface TableContextType {
   table: any; // tanstack Table 객체
   columnSizeMap: Map<string, any>; // 컬럼 크기 정보
   onColumnResize: (event: React.MouseEvent, columnId: string) => void; // 컬럼 리사이즈 핸들러
   tableTotalWidth: number; // 테이블 총 너비
   tableTotalHeight: number; // 테이블 총 높이
   displayRows: any[]; // 가상화된 행 데이터
   isEmptyState: boolean;
   bottomRef: React.RefObject<HTMLDivElement>;
   containerRef: React.RefObject<HTMLDivElement>;
   containerStyle: React.CSSProperties;
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
