import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as R from 'ramda';
import { dataItemsWithIndexes, getDataItem, getDataItemIndex, gridReducer, ParentGridState } from './data-grid';
import { getPagedData } from './pagination-util';
import { hasValue } from '../util/type';
import { DataGridColumn } from '../models';

// root state
export interface State {
  grid: ParentGridState;
}

// root reducer
export function reducer(state, action) {
  return gridReducer(state, action);
}

// feature selectors are used for getting a state from the root state
const getGridState = createFeatureSelector<State, ParentGridState>('grid');

// selectors are used for getting a state
export const getGridByName = createSelector(
  getGridState,
  (state: ParentGridState, props) => R.prop(props.gridName)(state)
);

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
  (grid) => <DataGridColumn[]>R.path(['columns'])(grid)
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
