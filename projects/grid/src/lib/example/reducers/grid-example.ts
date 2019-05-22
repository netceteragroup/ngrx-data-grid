import * as R from 'ramda';
import { GridExampleActions, GridExampleActionTypes } from '@example/actions/grid-example';
import { createActionHandler, createReducer } from '@grid/util';

// grid example state
export interface GridExampleState {
  columnsNum: number;
  rowsNum: number;
}

const initialState: GridExampleState = {
  columnsNum: 0,
  rowsNum: 0
};

// these are functions that take the existing state and return a new one
const addNewColumn = (state: GridExampleState): GridExampleState =>
  R.mergeDeepRight(state, {
    columnsNum: R.inc(state.columnsNum)
  });

const addNewRow = (state: GridExampleState): GridExampleState =>
  R.mergeDeepRight(state, {
    rowsNum: R.inc(state.rowsNum)
  });

// define the handlers for the action types
const addNewColumnHandler = createActionHandler(GridExampleActionTypes.AddNewColumn, addNewColumn);
const addNewRowHandler = createActionHandler(GridExampleActionTypes.AddNewRow, addNewRow);

// the reducer for the grid example state
export const gridExampleReducer = createReducer<GridExampleState, GridExampleActions>([
  addNewRowHandler,
  addNewColumnHandler
], initialState);
