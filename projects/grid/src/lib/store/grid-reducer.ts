import * as R from 'ramda';
import { GridActions, GridActionTypes } from '@grid/actions/grid-actions';
import { createActionHandler, createReducer } from '@grid/util';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

// grid state
export interface GridState {
  initialData: Object[];
  gridData: Object[];
  columnConfig: ColumnConfig[];
  gridConfig: GridConfig;
}

const initialState: GridState = {
  initialData: [],
  gridData: [],
  columnConfig: [],
  gridConfig: { visible: true }
};

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, payload: any): GridState => R.mergeDeepRight(state, R.mergeDeepWith(R.concat, {gridData: payload.initialData}, payload));


// define the handlers for the action types
const InitGridHandler = createActionHandler(GridActionTypes.InitGrid, initGrid);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, GridActions>([
  InitGridHandler
], initialState);
