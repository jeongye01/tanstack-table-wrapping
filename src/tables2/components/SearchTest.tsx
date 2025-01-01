import React from 'react';
import { useTableContext } from '../tableContext';

export const SearchTest = () => {
   const { tableTotalWidth } = useTableContext();
   console.log(tableTotalWidth);
   return <div>SearchTest</div>;
};
