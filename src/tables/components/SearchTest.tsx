import React, { useEffect } from "react";
import { useTableContext } from "../tableContext";

export const SearchTest = () => {
  const { tableTotalWidth, setColumnFilter } = useTableContext();
  console.log(tableTotalWidth);
  useEffect(() => {
    setColumnFilter("status", "Married");
  }, []);
  return <div>SearchTest</div>;
};
