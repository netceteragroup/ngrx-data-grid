import { createFeatureSelector, createSelector } from '@ngrx/store';
import { gridReducer, GridState } from './grid-reducer';

// root state
export interface State {
  grid: GridState;
}

// root reducer
export function reducer(state, action) {
  return gridReducer(state, action);
}

// feature selectors are used for getting a state from the root state
const getGrodState = createFeatureSelector('grid');

// selectors are used for getting a state
export const getGridData = createSelector(
  getGrodState,
  (state: GridState) => state.gridData
);
export const getCellConfig = createSelector(
  getGrodState,
  (state: GridState) => state.columnConfig
);
export const getGridConfig = createSelector(
  getGrodState,
  (state: GridState) => state.gridConfig
);
