export interface ColumnConfig {
  component: any;
  field: string;
  headerName: string;
  isVisible: boolean;
  comparator?: Function;
  valueFormatter?: Function;
  valueGetter?: Function;
  sorted?: string;
}

export interface DataAndConfig {
  data: any;
  config: ColumnConfig;
}
