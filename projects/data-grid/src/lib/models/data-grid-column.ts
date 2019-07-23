import { hasValue } from '../util/type';
import * as R from 'ramda';
import { filterWithCondition, GridDataFilter } from './data-grid-filter';
import { SortType } from './data-grid-sort';

export type ColumnValueGetter = <T extends object = object>(dataItem: T) => string;

export interface DataGridColumn {
  columnId: string;
  headerName: string;
  field: string;
  visible: boolean;
  sortAvailable: boolean;
  filterAvailable: boolean;
  filter?: GridDataFilter;
  sortType?: SortType;
  valueGetter?: ColumnValueGetter;
  component: any;
  componentInputName?: string; // TODO VV: check where is used this componentInputName
}

export const headerName = R.prop('headerName');
export const getColumnId = R.prop('columnId');
export const columnVisible = R.prop('visible');
export const columnField = R.prop('field');
export const columnSortAvailable = R.prop('sortAvailable');
export const columnSortType = R.propOr(null, 'sortType');
export const columnSortDefined = R.compose(hasValue, columnSortType);
export const columnFilterAvailable = R.prop('filterAvailable');
// TODO VV: remove any
export const columnFilter: any = R.propOr(null, 'filter');
export const columnFilterDefined: any = R.compose(hasValue, columnFilter);

export const findDataGridColumnById = (id: string, dataGridColumns: DataGridColumn[]) => <DataGridColumn>R.find(R.propEq('columnId', id))(dataGridColumns);
export const findDataGridColumnsWithFilters = (columns: DataGridColumn[]) => R.filter(R.allPass([columnFilterDefined, R.compose(filterWithCondition, columnFilter)]))(columns);
export const columnValueResolver: any = ({valueGetter, field}: DataGridColumn) => hasValue(valueGetter) ? valueGetter : R.prop(field);
