import { createSelector } from '@ngrx/store';
import * as R from 'ramda';
import * as fromDataGrid from './data-grid';
import { getPagedData } from './pagination-util';
import { isNotEmpty } from '../util/type';
import { getNumberOfVisibleColumns } from '../util/grid-columns';

export const getGridByName = (state: fromDataGrid.NgRxGridState, props: {gridName: string}) => R.prop(props.gridName)(state);

export const getGridDataRowsIndexes = createSelector(
  getGridByName,
  fromDataGrid.getRowDataIndexes
);

export const getGridSelectedRowIndexes = createSelector(
  getGridByName,
  fromDataGrid.getSelectedRowIndexes
);

export const getGridColumns = createSelector(
  getGridByName,
  fromDataGrid.getColumns
);

export const getGridPagination = createSelector(
  getGridByName,
  fromDataGrid.getPagination
);

export const getHasVisibleGridColumns = createSelector(
  getGridColumns,
  (columns) => getNumberOfVisibleColumns(columns) > 0
);

export const getGridData = createSelector(
  getGridByName,
  fromDataGrid.getData
);

export const getSelectedData = createSelector(
  getGridSelectedRowIndexes,
  getGridData,
  (selectedRowIndexes, data) =>
    R.values(R.pickAll(selectedRowIndexes, data))
);

export const hasData = createSelector(
  getGridData,
  isNotEmpty
);

export const getGridViewRowIndexes = createSelector(
  getGridDataRowsIndexes,
  getGridPagination,
  (rowDataIndexes, {paginationPageSize, currentPage}) => {
    return getPagedData(rowDataIndexes, currentPage, paginationPageSize);
  }
);

export const getGridViewData = createSelector(
  getGridData,
  getGridViewRowIndexes,
  (data, rowDataIndexes) => R.map(index => data[index], rowDataIndexes)
);

export const getAllSelected = createSelector(
  getGridByName,
  fromDataGrid.getAllSelected
);

export const getAllPagesSelected = createSelector(
  getGridByName,
  fromDataGrid.getAllPagesSelected
);

export const getCurrentPageSelected = createSelector(
  getGridByName,
  fromDataGrid.getCurrentPageSelected
);
