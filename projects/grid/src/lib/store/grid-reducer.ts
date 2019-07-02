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
    selection: {
      checkboxSelection: false,
      selectedRowsIds: []
    },
    pagination: {
      enabled: false,
      paginationPageSize: null,
      paginationPageSizeValues: [],
      currentPage: 0,
      numberOfPages: 0
    }
  }
};

const mapIndexed = R.addIndex(R.map);

const addRowIdToData = mapIndexed((val, idx) => R.assoc('gridRowId', idx, val));

const addRowIdToInitialData = (state) => R.assoc('initialData', addRowIdToData(state.initialData), state);

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, {payload: initialGridState}: InitGrid): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  ...addRowIdToInitialData(initialGridState), gridData: addRowIdToData(initialGridState.initialData)
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

const toggleRowSelection = (state: GridState, {payload: id}: any): GridState => {
  const selectedRows = state.gridConfig.selection.selectedRowsIds;
  return R.assocPath(
    ['gridConfig', 'selection', 'selectedRowsIds'],
    R.contains(id, selectedRows) ? R.reject((rowId) => rowId === id, selectedRows) : R.append(id, selectedRows),
    state
  );
};

const toggleSelectAllRows = (state: GridState): GridState => {
  const checkIfSelected = R.equals(state.gridConfig.selection.selectedRowsIds.length, state.gridData.length);

  return checkIfSelected ?
    R.assocPath(['gridConfig', 'selection', 'selectedRowsIds'], [], state) :
    R.assocPath(['gridConfig', 'selection', 'selectedRowsIds'], R.map(gridItem => R.prop('gridRowId', gridItem), state.gridData), state);
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
const ToggleRowSelectionHandler = createActionHandler(GridActionTypes.ToggleRowSelection, toggleRowSelection);
const ToggleSelectAllRowsHandler = createActionHandler(GridActionTypes.ToggleSelectAllRows, toggleSelectAllRows);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, GridActions>([
  InitGridHandler,
  ChangePageSizeHandler,
  ChangePageNumberHandler,
  SortGridHandler,
  ToggleRowSelectionHandler,
  ToggleSelectAllRowsHandler,
  FilterGrid,
  ToggleColumnVisibilityHandler
], initialState);
