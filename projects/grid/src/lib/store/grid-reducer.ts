import * as R from 'ramda';
import { ChangePageNumber, ChangePageSize, GridActions, GridActionTypes, InitGrid, ApplyFilter } from '@grid/actions/grid-actions';
import { createActionHandler, createReducer } from '@grid/util';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import { getFilteredData } from '@grid/store/grid-filter';
import { applySort } from '@grid/store/grid-sort';
import { calculateCurrentPage, calculatePagedDataAndNumberOfPages, calculatePaginationPageSize, changePagedData, mergeIntoGridConfig, updateColumnConfig } from '@grid/store/util';

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

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, {payload: initialGridState}: InitGrid): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  ...initialGridState, gridData: initialGridState.initialData
}));

const filterGrid = (state: GridState, {payload}: ApplyFilter): GridState => <GridState>calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {pagination: calculateCurrentPage(state.gridConfig.pagination, 0)}),
  gridData: applySort(<GridState>R.mergeDeepRight(state, {
    gridData: getFilteredData(<GridState>R.mergeDeepRight(state, {
      columnConfig: updateColumnConfig(state, payload)
    })),
    columnConfig: updateColumnConfig(state, payload)
  })),
  columnConfig: updateColumnConfig(state, payload)
}));

const changePageSize = (state: GridState, {payload: pageSize}: ChangePageSize): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(calculatePaginationPageSize(state.gridConfig.pagination, pageSize), 0)
  })
}));

const toggleColumnVisibility = (state: GridState, {payload: columnConfigIndex}: any): GridState => {
  const columnConfig = state.columnConfig;
  const columnConfigItem = columnConfig[columnConfigIndex];
  const currentConfigItemVisibility = R.prop('isVisible', columnConfigItem);
  const newConfigItem = R.assoc('isVisible', !currentConfigItemVisibility, columnConfigItem);
  const updatedColumnConfig = R.update(columnConfigIndex, newConfigItem, columnConfig);
  return R.assoc('columnConfig', updatedColumnConfig, state);
};

const sortGrid = (state: GridState, {payload}: any): GridState => {
  const newState: GridState = <GridState>R.mergeDeepRight(state, {columnConfig: R.map((config: ColumnConfig) => R.assoc('sortType', null, config), state.columnConfig)});
  return changePagedData(<GridState>R.mergeDeepRight(state, {
    gridData: applySort(<GridState>R.mergeDeepRight(state, {columnConfig: updateColumnConfig(newState, payload)})),
    columnConfig: updateColumnConfig(newState, payload)
  }));
};

const changePageNumber = (state: GridState, {payload: pageNumber}: ChangePageNumber): GridState => changePagedData(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(state.gridConfig.pagination, pageNumber)
  })
}));

// define the handlers for the action types
const InitGridHandler = createActionHandler(GridActionTypes.InitGrid, initGrid);
const ChangePageSizeHandler = createActionHandler(GridActionTypes.ChangePageSize, changePageSize);
const ChangePageNumberHandler = createActionHandler(GridActionTypes.ChangePageNumber, changePageNumber);
const SortGridHandler = createActionHandler(GridActionTypes.SortGrid, sortGrid);
const FilterGrid = createActionHandler(GridActionTypes.ApplyFilter, filterGrid);
const ToggleColumnVisibilityHandler = createActionHandler(GridActionTypes.ToggleColumnVisibility, toggleColumnVisibility);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, GridActions>([
  InitGridHandler,
  ChangePageSizeHandler,
  ChangePageNumberHandler,
  SortGridHandler,
  FilterGrid,
  ToggleColumnVisibilityHandler
], initialState);
