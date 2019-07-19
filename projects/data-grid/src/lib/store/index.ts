import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as R from 'ramda';
import {dataItemsWithIndexes, getDataItem, getDataItemIndex, gridReducer, ParentGridState} from './grid';
import {getPagedData} from './pagination-util';
import {toNumber} from '../util/type';

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

export const getGridData = createSelector(
  getGridByName,
  (grid) => R.path(['data'])(grid)
);

export const getGridDataRows = createSelector(
  getGridData,
  (gridData: []) => gridData.length
);

export const getGridSelectedRowIndexes = createSelector(
  getGridByName,
  (grid) => R.path(['selectedRowsIndexes'])(grid)
);

export const getGridActiveFilters = createSelector(
  getGridByName,
  (grid) => R.path(['activeFilters'])(grid)
);

export const getGridActiveSorting = createSelector(
  getGridByName,
  (grid) => R.path(['activeSorting'])(grid)
);

export const getGridPagination = createSelector(
  getGridByName,
  (grid) => R.path(['pagination'])(grid)
);

export const getGridViewData = createSelector(
  getGridByName,
  (grid) => {
    const {data, rowDataIndexes, pagination: {paginationPageSize, currentPage}} = grid;

    const dataWithIndexes = dataItemsWithIndexes(data);

    const dataItemToShow = R.compose((v) => R.contains(v, rowDataIndexes), toNumber, getDataItemIndex);
    const sortedAndFilteredData: any = R.compose(R.map(getDataItem), R.filter(dataItemToShow))(dataWithIndexes);

    return getPagedData(sortedAndFilteredData, currentPage, paginationPageSize);
  }
);
