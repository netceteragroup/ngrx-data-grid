import { GridColumnFilter } from './filter-config';

type ColumnValueGetterType = <T extends object = object>(dataItem: T) => string;
export interface ColumnConfig {
  component: any;
  field: string;
  headerName: string;
  isVisible: boolean;
  sortable: boolean;
  comparator?: Function;
  valueFormatter?: Function;
  valueGetter?: ColumnValueGetterType;
  sortType?: SortType;
  componentInputName?: string;
  filter: GridColumnFilter;
}

export interface DataAndConfig {
  data: any;
  dataItem?: any;
  config: ColumnConfig;
}

export enum SortType {
  Ascending = 'ASC',
  Descending = 'DESC'
}
