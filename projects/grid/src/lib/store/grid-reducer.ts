import * as R from 'ramda';
import { GridActions, GridActionTypes } from '@grid/actions/grid-actions';
import { createActionHandler, createReducer } from '@grid/util';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig, PaginationConfig } from '@grid/config/grid-config';

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
  gridConfig: {
    visible: true,
    pagination: {
      enabled: false,
      paginationPageSize: null,
      paginationPageSizeValues: [],
      currentPage: 0
    }

  }
};

const calculatePaginationPageSize = (pagination: PaginationConfig, paginationPageSize: any) => R.mergeDeepRight(pagination, {paginationPageSize: paginationPageSize});
const mergeIntoGridConfig = (gridConfig: GridConfig, pagination: any) => R.mergeDeepRight(gridConfig, pagination);

const calculateCurrentPage = (pagination: PaginationConfig, paginationCurrentPage: any) => R.mergeDeepRight(pagination, {currentPage: paginationCurrentPage});

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, {payload}: any): GridState => R.mergeDeepRight(state, {...payload, gridData: payload.initialData});

const changePageSize = (state: GridState, payload: any): GridState => R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculatePaginationPageSize(state.gridConfig.pagination, payload.paginationPageSize)
  })
});

const changePageNumber = (state: GridState, payload: any): GridState => R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(state.gridConfig.pagination, payload.currentPage)
  })
});

// const reInitializeGridByPageSize = (state: GridState, payload: any): GridState =>

// define the handlers for the action types
const InitGridHandler = createActionHandler(GridActionTypes.InitGrid, initGrid);
const ChangePageSizeHandler = createActionHandler(GridActionTypes.ChangePageSize, changePageSize);
const ChangePageNumberHandler = createActionHandler(GridActionTypes.ChangePageNumber, changePageNumber);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, GridActions>([
  InitGridHandler,
  ChangePageSizeHandler,
  ChangePageNumberHandler
], initialState);
