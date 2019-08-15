import { hasValue, mapIndexed } from '../util/type';
import * as R from 'ramda';
import { filterWithCondition, GridDataFilter } from './data-grid-filter';
import { SortType } from './data-grid-sort';

export type ColumnValueGetter = <T extends object = object>(dataItem: T) => string;

export interface DataGridColumn {
  headerName: string;
  field: string;
  visible: boolean;
  sortAvailable: boolean;
  filterAvailable: boolean;
  filter?: GridDataFilter;
  sortType?: SortType;
  valueGetter?: ColumnValueGetter;
  component: any;
}

export interface DataGridColumnWithId extends DataGridColumn {
  columnId: string;
}

export const headerName = R.prop('headerName');
export const getColumnId = R.prop('columnId');
type ColumnVisible = (c: DataGridColumnWithId) => boolean;
export const columnVisible: ColumnVisible = R.prop('visible');

export const columnSortAvailable = R.prop('sortAvailable');
export const columnSortType: any = R.propOr(null, 'sortType');
export const columnSortDefined = R.compose(hasValue, columnSortType);

export const columnFilterAvailable = R.prop('filterAvailable');
export const columnFilter: any = R.propOr(null, 'filter');
export const columnFilterDefined: any = R.compose(hasValue, columnFilter);

export const findDataGridColumnById = (id: string, dataGridColumns: DataGridColumnWithId[]) => <DataGridColumnWithId>R.find(R.propEq('columnId', id))(dataGridColumns);
export const findDataGridColumnsWithFilters = (columns: DataGridColumnWithId[]) => R.filter(R.allPass([columnFilterDefined, R.compose(filterWithCondition, columnFilter)]))(columns);
export const columnValueResolver: any = ({valueGetter, field}: DataGridColumnWithId) => hasValue(valueGetter) ? valueGetter : R.prop(field);

export const assignIdsToColumns: any = mapIndexed((column: DataGridColumn, idx: number) => {
  const {field} = column;
  const columnId = `${field}-${idx}`;
  return R.mergeDeepRight(column, {columnId});
});
