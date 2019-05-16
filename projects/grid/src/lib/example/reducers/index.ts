import { gridExampleReducer, GridExampleState } from '@example/reducers/grid-example';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
  gridExample: GridExampleState;
}

export function reducer(state, action) {
  return gridExampleReducer(state, action);
}

const getGridExampleState = createFeatureSelector('gridExample');

export const getRowsNum = createSelector(
  getGridExampleState,
  (state: GridExampleState) => state.rowsNum
);
export const getColumnsNum = createSelector(
  getGridExampleState,
  (state: GridExampleState) => state.columnsNum
);
