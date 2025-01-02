import { ContainerStyle } from '../type';

export const useContainerStyle = (option?: ContainerStyle) => {
   const {
      tableSize,
      rowHeight = 46, // FIXME:
      fontSize = 12,
   } = option || {};
   const containerStyle = {
      height: tableSize?.height ?? '100%',
      minHeight: tableSize?.minHeight,
      maxHeight: tableSize?.maxHeight,
      width: tableSize?.width ?? '100%',
      maxWidth: tableSize?.maxWidth,
      minWidth: tableSize?.minWidth,
      '--dbmaster-row-height': `${rowHeight}px`,
      '--dbmaster-font-size': `${fontSize}px`,
   } as React.CSSProperties;
   return { containerStyle };
};
