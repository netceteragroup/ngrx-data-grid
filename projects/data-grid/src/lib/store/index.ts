import { createSelector } from '@ngrx/store';
import * as R from 'ramda';
import { dataItemsWithIndexes, getDataItem, getDataItemIndex, NgRxGridState } from './data-grid';
import { getPagedData } from './pagination-util';
import { hasValue } from '../util/type';
import { DataGridColumnWithId } from '../models';

export const getGridByName = (state: NgRxGridState, props) => R.prop(props.gridName)(state);

export const getGridDataRowsIndexes = createSelector(
  getGridByName,
  (grid) => grid.rowDataIndexes
);

export const getGridSelectedRowIndexes = createSelector(
  getGridByName,
  (grid) => R.path(['selectedRowsIndexes'])(grid)
);

export const getGridColumns = createSelector(
  getGridByName,
  (grid) => <DataGridColumnWithId[]>R.path(['columns'])(grid)
);

export const getGridPagination = createSelector(
  getGridByName,
  (grid) => R.path(['pagination'])(grid)
);

const sortedAndFilteredData: any = R.compose(R.map(getDataItem), R.filter(hasValue));

export const getGridViewData = createSelector(
  getGridByName,
  (grid) => {
    const {data, rowDataIndexes, pagination: {paginationPageSize, currentPage}} = grid;

    const dataWithIndexes = dataItemsWithIndexes(data);

    const viewData = R.map(
      idx => R.find(R.compose(R.equals(idx), getDataItemIndex), dataWithIndexes),
      rowDataIndexes
    );

    return getPagedData(sortedAndFilteredData(viewData), currentPage, paginationPageSize);
  }
);
