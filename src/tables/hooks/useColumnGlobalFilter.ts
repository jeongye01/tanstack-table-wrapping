import { useState } from "react";

// NOTE: 컬럼에다가 enableGlobalFilter: false 넣어주면 전체 검색에 포함 안됨.
export const useColumnGlobalFilter = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  return { globalFilter, setGlobalFilter };
};
