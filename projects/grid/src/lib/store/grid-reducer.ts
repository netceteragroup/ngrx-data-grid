import * as R from 'ramda';
import { ChangePageNumber, ChangePageSize, GridActions, GridActionTypes, InitGrid } from '@grid/actions/grid-actions';
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

// these are functions that take the existing state and return a new one
const initGrid = (state: GridState, {payload: initialGridState}: InitGrid): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  ...initialGridState, gridData: initialGridState.initialData
}));

const changePageSize = (state: GridState, {payload: pageSize}: ChangePageSize): GridState => calculatePagedDataAndNumberOfPages(<GridState>R.mergeDeepRight(state, {
  gridConfig: mergeIntoGridConfig(state.gridConfig, {
    pagination: calculateCurrentPage(calculatePaginationPageSize(state.gridConfig.pagination, pageSize), 0)
  })
}));

const toggleColumnVisibility = (state: GridState, {payload}: any): GridState =>
  R.assoc(
    'columnConfig',
    R.update(payload, R.assoc('isVisible', !R.prop('isVisible', state.columnConfig[payload]), state.columnConfig[payload]), state.columnConfig),
    state
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
    changePagedData(sort)
  );
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
const ToggleColumnVisibilityHandler = createActionHandler(GridActionTypes.ToggleColumnVisibility, toggleColumnVisibility);

// the reducer for the grid state
export const gridReducer = createReducer<GridState, GridActions>([
  InitGridHandler,
  ChangePageSizeHandler,
  ChangePageNumberHandler,
  SortGridHandler,
  ToggleColumnVisibilityHandler
], initialState);
