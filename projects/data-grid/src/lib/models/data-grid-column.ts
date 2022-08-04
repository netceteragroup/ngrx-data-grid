import { hasValue, isString, mapIndexed } from '../util/type';
import * as R from 'ramda';
import { filterApplied, GridDataFilter } from './data-grid-filter';
import { SortType } from './data-grid-sort';
import { GridCell } from './grid-cell';
import { Type } from '@angular/core';

export type CompareResult = -1 | 0 | 1;
export type Comparator = <T extends object = object>(dataItem1: T, dataItem2: T) => CompareResult;

export type ColumnValueGetter = <T extends object = object>(dataItem: T) => any;
export type FieldType = string | string[];

export interface DataGridColumn {
  headerName: string;
  field?: FieldType;
  visible: boolean;
  sortAvailable: boolean;
  filterAvailable: boolean;
  filter?: GridDataFilter;
  sortType?: SortType;
  comparator?: Comparator;
  valueGetter?: ColumnValueGetter;
  component?: Type<GridCell>;
  width?: number;
  hideInSelection?: boolean;
}

export interface DataGridColumnWithId extends DataGridColumn {
  columnId: string;
}

export const HEADER_NAME_ID = 'headerName';
export const headerName = R.prop(HEADER_NAME_ID);
export const getColumnId = R.prop('columnId');
type ColumnVisible = (c: DataGridColumnWithId) => boolean;
export const columnVisible: ColumnVisible = R.prop('visible');
type ColumnHidden = (c: DataGridColumnWithId) => boolean;
export const columnHidden: ColumnHidden = R.compose(R.not, columnVisible);

export const columnComparator: any = R.propOr(null, 'comparator');
export const columnSortAvailable = R.prop('sortAvailable');
export const columnSortType: any = R.propOr(null, 'sortType');
export const columnSortDefined = R.compose(hasValue, columnSortType);

type ColumnFilterAvailable = (c: DataGridColumnWithId) => boolean;
export const columnFilterAvailable: ColumnFilterAvailable = R.prop<DataGridColumnWithId>('filterAvailable');

type GetFilter = (c: DataGridColumnWithId) => GridDataFilter;
export const columnFilter: GetFilter = R.propOr(null, 'filter');
type ColumnFilterDefined = (c: DataGridColumnWithId) => boolean;
export const columnFilterDefined: ColumnFilterDefined = R.compose(hasValue, columnFilter);

export const findDataGridColumnById = (id: string, dataGridColumns: DataGridColumnWithId[]): DataGridColumnWithId =>
  R.find(R.propEq('columnId', id))(dataGridColumns);

const isFilterDefinedAndApplied = R.allPass([columnFilterDefined, R.compose(filterApplied, columnFilter)]);

type findDataGridColumnsWithFilters = (columns: DataGridColumnWithId[]) => DataGridColumnWithId[];
export const findDataGridColumnsWithFilters: findDataGridColumnsWithFilters = R.filter(isFilterDefinedAndApplied);

export const getRawValueResolver = ({field}: DataGridColumnWithId): ColumnValueGetter => isString(field)
  ? R.prop(field)
  : R.path(field);

export const columnValueResolver = (dataGridColumn: DataGridColumnWithId): ColumnValueGetter =>
  hasValue(dataGridColumn.valueGetter) ? dataGridColumn.valueGetter : getRawValueResolver(dataGridColumn);

type AssignIdsToColumns = (c: DataGridColumn[]) => DataGridColumnWithId[];
export const assignIdsToColumns: AssignIdsToColumns = mapIndexed((column: DataGridColumn, idx: number) => {
  const {field} = column;
  const columnId = isString(field) ? `${field}-${idx}` : `${R.join('-', field)}-${idx}`;
  return R.mergeDeepRight(column, {columnId});
});
