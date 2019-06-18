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
const initGrid = (state: GridState, payload: any): GridState =>
  R.mergeDeepRight(
    state, {
      ...payload,
      gridData: payload.initialData
    }
  );

const sortGrid = (state: GridState, payload: any): GridState => {
  const descSort = R.sort(
    R.isNil(payload.prop.comparator) ?
      R.descend(R.prop(payload.prop.field)) :
      payload.prop.comparator,
    state.gridData
  );
  const ascSort = R.reverse(state.gridData);
  const unsortedConfig = R.map(x => R.assoc('sorted', null, x), state.columnConfig);
  const sorted = R.assoc('gridData', R.isNil(payload.prop.sorted) ? descSort : ascSort, state);
  const unsort = R.assoc('gridData', state.initialData, state);
  return R.assoc(
    'columnConfig',
    R.update(
      R.findIndex(R.propEq('headerName', payload.prop.headerName))(state.columnConfig),
      R.assoc('sorted', R.isNil(payload.prop.sorted) ? 'desc' : payload.prop.sorted === 'asc' ? null : 'asc', payload.prop),
      unsortedConfig
    ),
    payload.prop.sorted === 'asc' ? unsort : sorted
  );
};


// define the handlers for the action types
const InitGridHandler = createActionHandler(GridActionTypes.InitGrid, initGrid);
const SortGridHandler = createActionHandler(GridActionTypes.SortGrid, sortGrid);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, GridActions>([
  InitGridHandler,
  SortGridHandler
], initialState);
