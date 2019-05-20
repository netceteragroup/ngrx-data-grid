import { gridExampleReducer, GridExampleState } from '@example/reducers/grid-example';
import { createFeatureSelector, createSelector } from '@ngrx/store';

// root state
export interface State {
  gridExample: GridExampleState;
}

// root reducer
export function reducer(state, action) {
  return gridExampleReducer(state, action);
}

// feature selectors are used for getting a state from the root state
const getGridExampleState = createFeatureSelector('gridExample');

// selectors are used for getting a state
export const getRowsNum = createSelector(
  getGridExampleState,
  (state: GridExampleState) => state.rowsNum
);
export const getColumnsNum = createSelector(
  getGridExampleState,
  (state: GridExampleState) => state.columnsNum
);
