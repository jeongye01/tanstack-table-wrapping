import type { SortDirection } from '@tanstack/react-table';
import { MouseEventHandler } from 'react';

export const SortingButton = ({
   onClick,
   sortDirection,
}: {
   onClick: MouseEventHandler<HTMLButtonElement>;
   sortDirection?: SortDirection;
}) => {
   return (
      <button onClick={onClick} className="dbmaster-sorting-icon" aria-label="sort">
         {/* <ICON_ARROW_UP opacity={sortDirection === 'asc' ? 1 : 0.5} />
      <ICON_ARROW_DOWN opacity={sortDirection === 'desc' ? 1 : 0.5} /> */}
      </button>
   );
};
