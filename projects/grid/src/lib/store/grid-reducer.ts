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

const sortGrid = (state: GridState, {payload}: any): GridState => {
  const type = payload.sortType;
  const unsortedConfig = R.map(x => R.assoc('sortType', null, x), state.columnConfig);
  const sort = R.assoc(
    'gridData',
    (type === 'ASC') ? R.reverse(state.gridData) :
    (type === 'DESC') ? R.sort(R.isNil(payload.comparator) ? R.descend(R.prop(payload.field)) : payload.comparator, state.gridData) :
    state.initialData,
    state
  );
  return R.assoc(
    'columnConfig',
    R.update(
      R.findIndex(R.propEq('headerName', payload.headerName))(state.columnConfig),
      payload,
      unsortedConfig
    ),
    sort
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
