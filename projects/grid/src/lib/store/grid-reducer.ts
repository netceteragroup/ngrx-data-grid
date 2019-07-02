import * as R from 'ramda';
import { ChangePageNumber, ChangePageSize, FilterGrid, GridActions, GridActionTypes, InitGrid } from '@grid/actions/grid-actions';
import { createActionHandler, createReducer } from '@grid/util';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import {
  applySortAndFilter,
  calculateCurrentPage,
  calculatePagedDataAndNumberOfPages,
  calculatePaginationPageSize,
  changePagedData,
  mergeIntoGridConfig,
  updateColumnConfig,
  updateConfigAndApplySort
} from '@grid/store/grid';

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

const filterGrid = (state: GridState, {payload}: FilterGrid): GridState => {
  const updatedColumnConfig = updateColumnConfig(state, payload);

  return <GridState>calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(
    <GridState>R.mergeDeepRight(state, applySortAndFilter(state, updatedColumnConfig)), {
      gridConfig: mergeIntoGridConfig(state.gridConfig, {
        pagination: calculateCurrentPage(state.gridConfig.pagination, 0)
      })
    }));
};

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
  const updatedColumnConfig = updateColumnConfig(newState, payload);
  return changePagedData(<GridState>R.mergeDeepRight(state, updateConfigAndApplySort(state, updatedColumnConfig)
  ));
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
const FilterGridHandler = createActionHandler(GridActionTypes.FilterGrid, filterGrid);
const ToggleColumnVisibilityHandler = createActionHandler(GridActionTypes.ToggleColumnVisibility, toggleColumnVisibility);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, GridActions>([
  InitGridHandler,
  ChangePageSizeHandler,
  ChangePageNumberHandler,
  SortGridHandler,
  FilterGridHandler,
  ToggleColumnVisibilityHandler
], initialState);
