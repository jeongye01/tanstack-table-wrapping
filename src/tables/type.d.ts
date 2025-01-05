interface TableSizeOptions {
   width?: CSSProperties['width'];
   height?: CSSProperties['height'];
   minWidth?: CSSProperties['minWidth'];
   minHeight?: CSSProperties['minHeight'];
   maxWidth?: CSSProperties['maxWidth'];
   maxHeight?: CSSProperties['maxHeight'];
}

export interface TableStyleOption {
   tableSize?: TableSizeOptions;
   rowHeight?: number;
   fontSize?: number;
   bodyStyle?: 'default' | 'zebra';
}
export interface TableProps<TData> extends Pick<TableOptions<TData>, 'data' | 'columns'> {
   enableRowIndex?: boolean;
   onLoadMore?: () => void;
   hasMoreData?: boolean;
   styleOption?: TableStyleOption;
}
