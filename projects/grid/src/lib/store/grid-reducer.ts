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
  pagedData: Object[];
}

const initialState: GridState = {
  initialData: [],
  gridData: [],
  columnConfig: [],
  pagedData: [],
  gridConfig: {
    visible: true,
    pagination: {
      enabled: false,
      paginationPageSize: null,
      paginationPageSizeValues: [],
      currentPage: 0,
      numberOfPages: 0
    }
  }
};

const mergeIntoGridConfig = (gridConfig: GridConfig, pagination: any): GridConfig => R.mergeDeepRight(gridConfig, pagination);
const calculatePaginationPageSize = (pagination: PaginationConfig, paginationPageSize: any): PaginationConfig => R.mergeDeepRight(pagination, {paginationPageSize: paginationPageSize});
const calculateCurrentPage = (pagination: PaginationConfig, paginationCurrentPage: any): PaginationConfig => R.mergeDeepRight(pagination, {currentPage: paginationCurrentPage});
const changePagedData = (state: GridState): GridState => R.mergeDeepRight(state, {
  pagedData: <any>R.slice(
    state.gridConfig.pagination.currentPage * state.gridConfig.pagination.paginationPageSize,
    (state.gridConfig.pagination.currentPage + 1) * state.gridConfig.pagination.paginationPageSize,
    state.gridData)
});

const calculateNumberOfPages = (state: GridState): GridState => <GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: R.mergeDeepRight(state.gridConfig.pagination, {numberOfPages: Math.ceil(state.gridData.length / state.gridConfig.pagination.paginationPageSize)})
  })
});

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, {payload}: any): GridState => calculateNumberOfPages(changePagedData(R.mergeDeepRight(state, {...payload, gridData: payload.initialData})));

const changePageSize = (state: GridState, {payload}: any): GridState => calculateNumberOfPages(changePagedData(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(calculatePaginationPageSize(state.gridConfig.pagination, payload), 0)
  })
})));

const changePageNumber = (state: GridState, {payload}: any): GridState => changePagedData(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(state.gridConfig.pagination, payload)
  })
}));

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
