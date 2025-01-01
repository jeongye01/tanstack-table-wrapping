interface TableSizeOptions {
   width?: CSSProperties['width'];
   height?: CSSProperties['height'];
   minWidth?: CSSProperties['minWidth'];
   minHeight?: CSSProperties['minHeight'];
   maxWidth?: CSSProperties['maxWidth'];
   maxHeight?: CSSProperties['maxHeight'];
}

export interface ContainerStyle {
   // size 옵션으로 바꿔야 하나
   tableSize?: TableSizeOptions;
   rowHeight?: number;
   fontSize?: number;
}
export interface TableProps<TData> extends Pick<TableOptions<TData>, 'data' | 'columns'> {
   enableRowIndex?: boolean;
   onLoadMore?: () => void;
   hasMoreData?: boolean;
   option?: ContainerStyle;
}
