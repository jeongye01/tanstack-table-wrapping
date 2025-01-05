import { useTable } from '../hooks/useTable';
import { TableProvider } from '../tableContext';
import { TableProps } from '../type';

export const Table = <TData,>(props: TableProps<TData> & { children: React.ReactNode }) => {
   const { children, customRowOptions, ...tableProps } = props;

   const table = useTable<TData>(tableProps);
   return (
      <TableProvider
         value={{
            ...table,
            customRowOptions,
         }}
      >
         {children}
      </TableProvider>
   );
};
