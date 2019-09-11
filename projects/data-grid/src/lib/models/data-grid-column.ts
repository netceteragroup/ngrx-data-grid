import { hasValue, mapIndexed } from '../util/type';
import * as R from 'ramda';
import { filterApplied, GridDataFilter } from './data-grid-filter';
import { SortType } from './data-grid-sort';
import { GridCell } from './grid-cell';
import { Type } from '@angular/core';

export type ColumnValueGetter = <T extends object = object>(dataItem: T) => any;

export interface DataGridColumn {
  headerName: string;
  field?: string;
  visible: boolean;
  sortAvailable: boolean;
  filterAvailable: boolean;
  filter?: GridDataFilter;
  sortType?: SortType;
  valueGetter?: ColumnValueGetter;
  component?: Type<GridCell>;
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

export const getRawValueResolver = ({field}: DataGridColumnWithId): ColumnValueGetter => R.prop(field);

export const columnValueResolver = ({valueGetter, field}: DataGridColumnWithId): ColumnValueGetter =>
  hasValue(valueGetter) ? valueGetter : R.prop(field);

type AssignIdsToColumns = (c: DataGridColumn[]) => DataGridColumnWithId[];
export const assignIdsToColumns: AssignIdsToColumns = mapIndexed((column: DataGridColumn, idx: number) => {
  const {field} = column;
  const columnId = `${field}-${idx}`;
  return R.mergeDeepRight(column, {columnId});
});
