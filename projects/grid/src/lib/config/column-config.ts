import { BaseColumnFilter } from '@grid/config/filter-config';

export interface ColumnConfig {
  component: any;
  field: string;
  headerName: string;
  isVisible: boolean;
  sortable: boolean;
  comparator?: Function;
  valueFormatter?: Function;
  valueGetter?: Function;
  sortType?: SortType;
  filter: BaseColumnFilter;
}

export interface DataAndConfig {
  data: any;
  config: ColumnConfig;
}

export enum SortType {
  Ascending = 'ASC',
  Descending = 'DESC'
}
