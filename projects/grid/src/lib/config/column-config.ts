export interface ColumnConfig {
  component: any;
  field: string;
  headerName: string;
  isVisible: boolean;
  valueFormatter?: Function;
  valueGetter?: Function;
}

export interface DataAndConfig {
  data: any;
  config: ColumnConfig;
}

export interface GridConfig {
  visable: boolean;
}
