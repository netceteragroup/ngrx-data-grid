import * as R from 'ramda';
import { ActionsUnion, GridActionTypes } from './grid-actions';
import { createActionHandler, createReducer } from '@grid/util';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

// grid state
export interface GridState {
  gridData: Object[];
  columnConfig: ColumnConfig[];
  gridConfig: GridConfig;
}

const initialState: GridState = {
  gridData: [{
    empty: 'empty'
  }],
  columnConfig: [{
    component: null,
    field: 'empty',
    headerName: 'PCS Grid',
    isVisible: true
  }],
  gridConfig: { visable: true }
};

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, payload: any): GridState =>
  R.mergeDeepRight(state, payload);

// define the handlers for the action types
const initGridDataHandler = createActionHandler(GridActionTypes.InitGridData, initGrid);
const initColumnConfigHandler = createActionHandler(GridActionTypes.InitColumnConfig, initGrid);
const initGridConfigHandler = createActionHandler(GridActionTypes.InitGridConfig, initGrid);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, ActionsUnion>([
  initGridDataHandler,
  initColumnConfigHandler,
  initGridConfigHandler
], initialState);
