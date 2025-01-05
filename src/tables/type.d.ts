interface TableSizeOptions {
   width?: CSSProperties['width'];
   height?: CSSProperties['height'];
   minWidth?: CSSProperties['minWidth'];
   minHeight?: CSSProperties['minHeight'];
   maxWidth?: CSSProperties['maxWidth'];
   maxHeight?: CSSProperties['maxHeight'];
}
export interface CustomRowOptions<TData> {
   rowClassName?: (params: { rowId: RowId; rowData: TData }) => string;
   rowStyle?: (params: { rowId: RowId; rowData: TData }) => React.CSSProperties;
   rowEvent?: (params: { rowId: RowId; rowData: TData }) => React.HTMLAttributes<HTMLTableRowElement>;
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
   customRowOptions?: CustomRowOptions<TData>;
}
