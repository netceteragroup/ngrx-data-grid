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
    checkboxSelection: false,
    selectedRowsIds: [],
    pagination: {
      enabled: false,
      paginationPageSize: null,
      paginationPageSizeValues: [],
      currentPage: 0,
      numberOfPages: 0
    }
  }
};

<<<<<<< HEAD
const mergeIntoGridConfig = (gridConfig: GridConfig, pagination: { pagination: PaginationConfig }): GridConfig => <GridConfig>R.mergeDeepRight(gridConfig, pagination);
const calculatePaginationPageSize = (pagination: PaginationConfig, paginationPageSize: number): PaginationConfig => R.mergeDeepRight(pagination, {
  paginationPageSize: paginationPageSize
});
const calculateCurrentPage = (pagination: PaginationConfig, paginationCurrentPage: number): PaginationConfig => R.mergeDeepRight(pagination, {
  currentPage: paginationCurrentPage
});
const changePagedData = (state: GridState): GridState => R.mergeDeepRight(state, {
  pagedData: <any>R.slice(
    state.gridConfig.pagination.currentPage * state.gridConfig.pagination.paginationPageSize,
    (state.gridConfig.pagination.currentPage + 1) * state.gridConfig.pagination.paginationPageSize,
    state.gridData)
});

const calculateNumberOfPages = (state: GridState): GridState => <GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: R.mergeDeepRight(state.gridConfig.pagination, {
      numberOfPages: Math.ceil(state.gridData.length / state.gridConfig.pagination.paginationPageSize)
    })
  })
});

type CalculatePagedDataAndNumberOfPages = (state: GridState) => GridState;
const calculatePagedDataAndNumberOfPages: CalculatePagedDataAndNumberOfPages = R.compose(
  calculateNumberOfPages,
  changePagedData
);

const mapIndexed = R.addIndex(R.map);

const addRowIdToData = mapIndexed((val, idx) => R.assoc('gridRowId', idx, val));

=======
>>>>>>> c56a5070d213a5bc0d1cbd5d47c209f48a43c5dd
// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, {payload: initialGridState}: InitGrid): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  ...initialGridState, gridData: addRowIdToData(initialGridState.initialData)
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
<<<<<<< HEAD
  const type = payload.sortType;
  const unsortedConfig = R.map(x => R.assoc('sortType', null, x), state.columnConfig);
  const sort = R.assoc(
    'gridData',
    (type === 'ASC') ? R.reverse(state.gridData) :
    (type === 'DESC') ? R.sort(R.isNil(payload.comparator) ? R.descend(R.prop(payload.field)) : payload.comparator, state.gridData) :
    addRowIdToData(state.initialData),
    state
  );
  return R.assoc(
    'columnConfig',
    R.update(
      R.findIndex(R.propEq('headerName', payload.headerName))(state.columnConfig),
      payload,
      unsortedConfig
    ),
    changePagedData(sort)
  );
=======
  const newState: GridState = <GridState>R.mergeDeepRight(state, {columnConfig: R.map((config: ColumnConfig) => R.assoc('sortType', null, config), state.columnConfig)});
  return changePagedData(<GridState>R.mergeDeepRight(state, {
    gridData: applySort(<GridState>R.mergeDeepRight(state, {columnConfig: updateColumnConfig(newState, payload)})),
    columnConfig: updateColumnConfig(newState, payload)
  }));
>>>>>>> c56a5070d213a5bc0d1cbd5d47c209f48a43c5dd
};

const toggleRowSelection = (state: GridState, {payload: id}: any): GridState => {
  const selectedRows = state.gridConfig.selectedRowsIds;
  return R.assocPath(
    ['gridConfig', 'selectedRowsIds'],
    R.contains(id, selectedRows) ? R.reject((rowId) => rowId === id, selectedRows) : R.append(id, selectedRows),
    state
  );
};

const toggleSelectAllRows = (state: GridState): GridState => {
  const checkIfSelected = R.equals(state.gridConfig.selectedRowsIds.length, state.gridData.length);

  return checkIfSelected ?
    R.assocPath(['gridConfig', 'selectedRowsIds'], [], state) :
    R.assocPath(['gridConfig', 'selectedRowsIds'], R.map(gridItem => R.prop('gridRowId', gridItem), state.gridData), state);
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
<<<<<<< HEAD
  ToggleRowSelectionHandler,
  ToggleSelectAllRowsHandler,
=======
  FilterGrid,
>>>>>>> c56a5070d213a5bc0d1cbd5d47c209f48a43c5dd
  ToggleColumnVisibilityHandler
], initialState);
