import * as R from 'ramda';
import { ActionsUnion, GridActionTypes } from './grid-actions';
import { createActionHandler, createReducer } from '@grid/util';
import { ColumnConfig, GridConfig } from '@grid/config/Config';

// grid state
export interface GridState {
  gridData: Object[];
  columnConfig: ColumnConfig[];
  gridConfig: GridConfig;
}

const initialState: GridState = {
  gridData: [],
  columnConfig: [],
  gridConfig: { visable: true }
};

// these are functions that take the existing state and return a new one
const updateGrid = (state: GridState, payload: any): GridState =>
  R.mergeDeepRight(state, payload);

// define the handlers for the action types
const updateGridDataHandler = createActionHandler(GridActionTypes.UpdateGridData, updateGrid);
const updateColumnConfigHandler = createActionHandler(GridActionTypes.UpdateColumnConfig, updateGrid);
const updateGridConfigHandler = createActionHandler(GridActionTypes.UpdateGridConfig, updateGrid);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, ActionsUnion>([
  updateGridDataHandler,
  updateColumnConfigHandler,
  updateGridConfigHandler
], initialState);
