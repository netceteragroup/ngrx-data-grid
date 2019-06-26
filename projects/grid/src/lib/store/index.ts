import { createFeatureSelector, createSelector } from '@ngrx/store';
import { gridReducer, GridState } from './grid-reducer';
import { GridConfig } from '@grid/config/grid-config';

// root state
export interface State {
  grid: GridState;
}

// root reducer
export function reducer(state, action) {
  return gridReducer(state, action);
}

// feature selectors are used for getting a state from the root state
const getGridState = createFeatureSelector('grid');

// selectors are used for getting a state
export const getGridData = createSelector(
  getGridState,
  (state: GridState) => state.gridData
);
export const getColumnConfig = createSelector(
  getGridState,
  (state: GridState) => state.columnConfig
);
export const getGridConfig = createSelector(
  getGridState,
  (state: GridState) => state.gridConfig
);

export const getPaginationConfig = createSelector(
  getGridConfig,
  (state: GridConfig) => state.pagination
);

export const getPagedData = createSelector(
  getGridState,
  (state: GridState) => state.pagedData
);

export const getSelectedRows = createSelector(
  getGridConfig,
  (config: GridConfig) => config.selectedRowsIndexes
);

export const getNumberOfRows = createSelector(
  getGridState,
  (state: GridState) => state.gridData.length
)
