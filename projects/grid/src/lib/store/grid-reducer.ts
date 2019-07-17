import { createReducer, on } from '@ngrx/store';
import * as R from 'ramda';
import * as GridActions from '../actions/grid-actions';
import {
  applySortAndFilter,
  calculateCurrentPage,
  calculatePagedDataAndNumberOfPages,
  calculatePaginationPageSize,
  changePagedData,
  mergeIntoGridConfig,
  updateColumnConfig,
  updateConfigAndApplySort
} from './grid';
import { ColumnConfig, GridConfig } from '../config';
import { InitGridPayload } from '../actions/init-grid-payload';

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

const addRowIdToData = mapIndexed((val: any, idx: number) => R.assoc('gridRowId', idx, val));

const addRowIdToInitialData = (state) => R.assoc('initialData', addRowIdToData(state.initialData), state);

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, initialGridState: InitGridPayload): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  ...addRowIdToInitialData(initialGridState), gridData: addRowIdToData(initialGridState.initialData)
}));

const filterGrid = (state: GridState, config: ColumnConfig): GridState => {
  const updatedColumnConfig = updateColumnConfig(state, config);

  return <GridState>calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(
    <GridState>R.mergeDeepRight(state, applySortAndFilter(state, updatedColumnConfig)), {
      gridConfig: mergeIntoGridConfig(state.gridConfig, {
        pagination: calculateCurrentPage(state.gridConfig.pagination, 0)
      })
    }));
};

const changePageSize = (state: GridState, {pageSize}): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(calculatePaginationPageSize(state.gridConfig.pagination, pageSize), 0)
  })
}));

const toggleColumnVisibility = (state: GridState, {columnConfigIndex}): GridState => {
  const columnConfig = state.columnConfig;
  const columnConfigItem = columnConfig[columnConfigIndex];
  const currentConfigItemVisibility = R.prop('isVisible', columnConfigItem);
  const newConfigItem = R.assoc('isVisible', !currentConfigItemVisibility, columnConfigItem);
  const updatedColumnConfig = R.update(columnConfigIndex, newConfigItem, columnConfig);
  return R.assoc('columnConfig', updatedColumnConfig, state);
};

const sortGrid = (state: GridState, config): GridState => {
  const newState: GridState = <GridState>R.mergeDeepRight(state, {columnConfig: R.map((cfg: ColumnConfig) => R.assoc('sortType', null, cfg), state.columnConfig)});
  const updatedColumnConfig = updateColumnConfig(newState, config);
  return changePagedData(<GridState>R.mergeDeepRight(state, updateConfigAndApplySort(state, updatedColumnConfig)
  ));
};

const toggleRowSelection = (state: GridState, {rowId}): GridState => {
  const selectedRows = state.gridConfig.selection.selectedRowsIds;
  return R.assocPath(
    ['gridConfig', 'selection', 'selectedRowsIds'],
    R.contains(rowId, selectedRows) ? R.reject((id) => id === rowId, selectedRows) : R.append(rowId, selectedRows),
    state
  );
};

const toggleAllRowsSelection = (state: GridState): GridState => {
  const checkIfSelected = R.equals(state.gridConfig.selection.selectedRowsIds.length, state.gridData.length);

  return checkIfSelected ?
    R.assocPath(['gridConfig', 'selection', 'selectedRowsIds'], [], state) :
    R.assocPath(['gridConfig', 'selection', 'selectedRowsIds'], R.map(gridItem => R.prop('gridRowId', gridItem), state.gridData), state);
};

const changePageNumber = (state: GridState, {pageNumber}): GridState => changePagedData(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(state.gridConfig.pagination, pageNumber)
  })
}));

export const reducer = createReducer(
  initialState,
  on(GridActions.initGrid, initGrid),
  on(GridActions.changePageSize, changePageSize),
  on(GridActions.changePageNumber, changePageNumber),
  on(GridActions.sortGrid, sortGrid),
  on(GridActions.filterGrid, filterGrid),
  on(GridActions.toggleColumnVisibility, toggleColumnVisibility),
  on(GridActions.toggleRowSelection, toggleRowSelection),
  on(GridActions.toggleAllRowsSelection, toggleAllRowsSelection)
);
