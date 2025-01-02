import { flexRender } from '@tanstack/react-table';
import { useTableContext } from '../../tableContext';
import { SortingButton } from './SortingButton';

export const TableHeader = () => {
   const { table, columnSizeMap, onColumnResize } = useTableContext();

   return (
      <thead className="dbmaster-thead">
         {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="dbmaster-tr">
               {columnSizeMap &&
                  headerGroup.headers.map(header => (
                     <th
                        key={header.id}
                        style={{
                           width: columnSizeMap.get(header.id)?.size,
                           left: columnSizeMap.get(header.id)?.startLeft,
                        }}
                        data-column-id={header.id}
                        className="dbmaster-th"
                     >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                           <SortingButton
                              sortDirection={header.column.getIsSorted() || undefined}
                              onClick={() => header.column.toggleSorting()}
                           />
                        )}
                        {header.column.getCanResize() && (
                           <div
                              {...{
                                 onDoubleClick: () => header.column.resetSize(),
                                 onMouseDown: event => onColumnResize()(event, header.id),
                                 className: `
                               dbmaster-column-resizer-bar
                               ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                              }}
                           />
                        )}
                     </th>
                  ))}
            </tr>
         ))}
      </thead>
   );
};
