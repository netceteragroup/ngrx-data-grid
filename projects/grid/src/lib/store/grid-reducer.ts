import * as R from 'ramda';
import { ActionsUnion, GridActionTypes } from './grid-actions';
import { createActionHandler, createReducer } from '@grid/util';
import { ColumnConfig, GridConfig } from '@grid/config/Config';

// grid state
export interface GridState {
  gridData: Object[];
  columnConfig: Object[];
  gridConfig: Object;
}

const initialState: GridState = {
  gridData: [],
  columnConfig: [],
  gridConfig: {}
};

// these are functions that take the existing state and return a new one
const updateGridData = (state: GridState, payload: any): GridState =>
  R.mergeDeepRight(state, {
    gridData: payload
  });

const updateColumnConfig = (state: GridState, payload: any): GridState =>
  R.mergeDeepRight(state, {
    columnConfig: payload
  });

const updateGridConfig = (state: GridState, payload: any): GridState =>
  R.mergeDeepRight(state, {
    gridConfig: payload
  });

// define the handlers for the action types
const updateGridDataHandler = createActionHandler(GridActionTypes.UpdateGridData, updateGridData);
const updateColumnConfigHandler = createActionHandler(GridActionTypes.UpdateColumnConfig, updateColumnConfig);
const updateGridConfigHandler = createActionHandler(GridActionTypes.UpdateGridConfig, updateGridConfig);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, ActionsUnion>([
  updateGridDataHandler,
  updateColumnConfigHandler,
  updateGridConfigHandler
], initialState);
