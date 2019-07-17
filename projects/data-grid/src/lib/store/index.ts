import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as R from 'ramda';
import { GridConfig } from '../config';
import {reducer as gridReducer, GridState} from './grid-reducer';

// root state
export interface State {
  grid: GridState;
}

// root reducer
export function reducer(state, action) {
  return gridReducer(state, action);
}

// feature selectors are used for getting a state from the root state
const getGridState = createFeatureSelector<State, GridState>('grid');

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

export const getSelectedRowIndexes = createSelector(
  getGridConfig,
  (config: GridConfig) => config.selection.selectedRowsIds
);

export const getNumberOfRows = createSelector(
  getGridState,
  (state: GridState) => state.gridData.length
);

export const getSelectedRows = createSelector(
  getGridData,
  getSelectedRowIndexes,
  (data: Array<Object>, indexes: Array<any>) => R.filter(R.compose(R.flip(R.contains)(indexes), R.prop('gridRowId')), data)
);

export const getSelectionConfig = createSelector(
  getGridConfig,
  (config: GridConfig) => config.selection
);
