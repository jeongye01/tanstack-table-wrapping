import clsx from 'clsx';
import { TableStyleOption } from '../type';

export const useTableStyle = (styleOption?: TableStyleOption) => {
   const {
      tableSize,
      rowHeight = 46, // FIXME:
      fontSize = 12,
      bodyStyle = 'default',
   } = styleOption || {};
   const tableStyle = {
      height: tableSize?.height ?? '100%',
      minHeight: tableSize?.minHeight,
      maxHeight: tableSize?.maxHeight,
      width: tableSize?.width ?? '100%',
      maxWidth: tableSize?.maxWidth,
      minWidth: tableSize?.minWidth,
      '--dbmaster-row-height': `${rowHeight}px`,
      '--dbmaster-font-size': `${fontSize}px`,
   } as React.CSSProperties;
   const tableClassName = clsx(bodyStyle);
   return { tableStyle, tableClassName };
};
