type ColumnValueGetter = <T extends object = object>(dataItem: T) => string;
// TODO VV: should be removed
export interface ColumnConfig {
  component: any;
  field: string;
  headerName: string;
  isVisible: boolean;
  sortable: boolean;
  comparator?: Function;
  valueFormatter?: Function;
  valueGetter?: ColumnValueGetter;
  sortType?: any;
  componentInputName?: string;
  filter: any;
}

// TODO VV: should be removed
export interface DataAndConfig {
  data: any;
  dataItem?: any;
  config: ColumnConfig;
}
