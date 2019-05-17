import * as R from 'ramda';
import { Action } from '@ngrx/store';
import { GridExampleActionTypes } from '@example/actions/grid-example';
import { createActionHandler, findHandlerForAction } from '@example/util';

export interface GridExampleState {
  columnsNum: number;
  rowsNum: number;
}

const initialState: GridExampleState = {
  columnsNum: 0,
  rowsNum: 0
};

const addNewColumn = (state: GridExampleState): GridExampleState =>
  R.mergeDeepRight(state, {
    columnsNum: R.inc(state.columnsNum)
  });

const addNewRow = (state: GridExampleState): GridExampleState =>
  R.mergeDeepRight(state, {
    rowsNum: R.inc(state.rowsNum)
  });

const addNewColumnHandler = createActionHandler(GridExampleActionTypes.AddNewColumn, addNewColumn);
const addNewRowHandler = createActionHandler(GridExampleActionTypes.AddNewRow, addNewRow);

export const gridExampleReducer = (state: GridExampleState = initialState, action: Action): GridExampleState => {
  const handler = findHandlerForAction(action, [
    addNewColumnHandler,
    addNewRowHandler
  ]);

  const updatedState = handler(state);

  return updatedState !== state ? updatedState : state;
};
