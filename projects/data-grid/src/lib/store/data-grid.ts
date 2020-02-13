import * as R from 'ramda';
import { PaginationConfig, SelectionType } from '../config';
import { createReducer, on } from '@ngrx/store';
import * as GridActions from '../actions/data-grid-actions';
import { calculateNumberOfPages, getPagedData } from './pagination-util';
import { applySorting } from './sorting-util';
import { hasValue, isNotEqual, isTrue } from '../util/type';
import {
  FilterGridPayload,
  InitGridPayload,
  SortGridPayload,
  UpdateGridDataPayload
} from '../actions/data-grid-payload';
import {
  columnComparator,
  columnSortDefined,
  columnSortType,
  columnValueResolver,
  DataGridColumnWithId,
  findDataGridColumnById,
  getColumnId
} from '../models';
import { applyFilters, getAppliedFilters } from './filters-util';
import { isCheckboxSelection } from '../util/selection';

export interface NgRxGridState {
  [key: string]: GridState;
}

export interface GridState<T extends object = object> {
  data: T[];
  rowDataIndexes: number[];
  selectedRowsIndexes: number[];
  activeSorting: string[]; // column ids (order is important)
  pagination: PaginationConfig;
  columns: DataGridColumnWithId[];
  allSelected: boolean;
  allPagesSelected: boolean;
  currentPageSelected: boolean;
}

export const initialState: NgRxGridState = {};

const initialPagination: PaginationConfig = {
  enabled: true,
  paginationPageSize: null,
  paginationPageSizeValues: [5, 10, 20, 100],
  currentPage: 0,
  numberOfPages: 0
};

export const initialGridState: GridState = {
  data: [],
  rowDataIndexes: [],
  selectedRowsIndexes: [],
  activeSorting: [],
  pagination: initialPagination,
  columns: [],
  allSelected: false,
  allPagesSelected: false,
  currentPageSelected: false
};

// Selectors
type GetIndexes = (state: GridState) => number[];
export const getSelectedRowIndexes: GetIndexes = R.propOr([], 'selectedRowsIndexes');
export const getRowDataIndexes: GetIndexes = R.propOr([], 'rowDataIndexes');
export const getData = R.propOr([], 'data');

type GetBoolean = (state: GridState) => boolean;
export const getAllSelected: GetBoolean = R.propOr(false, 'allSelected');
export const getAllPagesSelected: GetBoolean = R.propOr(false, 'allPagesSelected');
export const getCurrentPageSelected: GetBoolean = R.propOr(false, 'currentPageSelected');

type GetColumns = (state: GridState) => DataGridColumnWithId[];
export const getColumns: GetColumns = R.prop('columns');

type GetPagination = (state: GridState) => PaginationConfig;
export const getPagination: GetPagination = R.propOr(initialPagination, 'pagination');

const calculateRowDataIndexes = (gridState: GridState) => {
  const {data, activeSorting, columns} = gridState;

  const appliedSorting: any = R.map((columnId: string) => {
    const column: DataGridColumnWithId = findDataGridColumnById(columnId, columns);
    return {
      sortType: columnSortType(column),
      valueResolver: columnValueResolver(column),
      comparator: columnComparator(column)
    };
  }, activeSorting);

  const appliedFilters = getAppliedFilters(columns);
  const applyFiltersAndSorting = R.compose(applySorting(appliedSorting), applyFilters(appliedFilters));
  const filteredAndSortedData = applyFiltersAndSorting(data);

  const rowDataIndexes = R.map((dataItem) =>
    R.findIndex(item => item === dataItem, data),
    filteredAndSortedData
  );

  return R.filter(hasValue, rowDataIndexes);
};

const initGridHandler = (state: GridState, newState: InitGridPayload): GridState => {
  const {data, columns, paginationPageSize} = newState;
  const activeSorting = R.compose(R.map(getColumnId), R.filter(columnSortDefined))(columns) as string[];

  return R.mergeRight(initialGridState, {
    data,
    columns,
    activeSorting,
    pagination: {...initialGridState.pagination, paginationPageSize}
  });
};

const sortGridHandler = (state: GridState, {columnId, sortType}: SortGridPayload): GridState => {
  const {activeSorting, columns} = state;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.mergeRight(column, {sortType}) : column;
  }, columns);

  // 1. remove if sort of this field is already applied
  const updatedSorting: any = R.filter(isNotEqual(columnId), activeSorting);
  // 2. add new/updated sort at the end
  return R.mergeRight(state, {
    columns: updatedColumns,
    activeSorting: hasValue(sortType) ? R.append(columnId, updatedSorting) : updatedSorting
  });
};

const filterGridHandler = (state: GridState, {columnId, option, value}: FilterGridPayload): GridState => {
  const {columns} = state;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column)
      ? R.mergeRight(column, {filter: R.mergeRight(column.filter, {option, value})})
      : column;
  }, columns);

  return R.mergeRight(state, {columns: updatedColumns});
};

const resetGridStateHandler = (): GridState => initialGridState;

const changePageSizeHandler = (state: GridState, {pageSize}): GridState => R.mergeRight(state, {
  pagination: {...state.pagination, paginationPageSize: pageSize}
});

const changePageNumberHandler = (state: GridState, {pageNumber}): GridState => R.mergeRight(state, {
  pagination: {...state.pagination, currentPage: pageNumber}
});

const toggleRadioSelection = (state: GridState, dataItemIndex: number): GridState => {
  return R.mergeRight(state, {
    selectedRowsIndexes: [dataItemIndex]
  });
};

const toggleCheckboxSelection = (state: GridState, dataItemIndex: number): GridState => {
  const {selectedRowsIndexes} = state;
  const updateSelectionList = R.ifElse(R.contains(dataItemIndex), R.filter(isNotEqual(dataItemIndex)), R.append(dataItemIndex));

  return R.mergeRight(state, {
    selectedRowsIndexes: R.equals(-1, dataItemIndex)
      ? selectedRowsIndexes
      : updateSelectionList(selectedRowsIndexes) as number[],
    allSelected: false,
    allPagesSelected: false,
    currentPageSelected: false
  });
};

const toggleRowSelectionHandler = (state: GridState, {dataItem, selectionType}): GridState => {
  const {data} = state;
  const dataItemIndex = R.findIndex(R.equals(dataItem), data);

  return isCheckboxSelection(selectionType)
    ? toggleCheckboxSelection(state, dataItemIndex)
    : toggleRadioSelection(state, dataItemIndex);
};

const toggleAllRowsSelectionHandler = (state: GridState, {selectionStatus}): GridState => {
  const {rowDataIndexes} = state;

  const updatedSelectionList = isTrue(selectionStatus) ? rowDataIndexes : [];

  return R.mergeRight(state, {
    selectedRowsIndexes: updatedSelectionList,
    allSelected: selectionStatus,
    allPagesSelected: selectionStatus,
    currentPageSelected: false
  });
};

const toggleColumnVisibilityHandler = (state: GridState, {columnId}): GridState => {
  const {columns} = state;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.mergeRight(column, {visible: !column.visible}) : column;
  }, columns);

  return R.mergeRight(state, {columns: updatedColumns});
};

const selectAllPages = (state: GridState): GridState => {
  const {rowDataIndexes} = state;

  return R.mergeRight(state, {
    selectedRowsIndexes: rowDataIndexes,
    allPagesSelected: true,
    currentPageSelected: false
  });
};

const selectCurrentPage = (state: GridState): GridState => {
  const {pagination, rowDataIndexes} = state;
  const {currentPage, paginationPageSize} = pagination;

  return R.mergeRight(state, {
    selectedRowsIndexes: getPagedData(rowDataIndexes, currentPage, paginationPageSize),
    currentPageSelected: true,
    allPagesSelected: false
  });
};

const recalculateRowIndexesAndPagination = (state: GridState): any => {
  const newRowDataIndexes = calculateRowDataIndexes(state);
  const prevPagination = state.pagination;
  const numberOfPages = calculateNumberOfPages(newRowDataIndexes.length, state.pagination.paginationPageSize);
  const currentPage = prevPagination.currentPage > numberOfPages
    ? initialPagination.currentPage
    : prevPagination.currentPage;

  return R.mergeRight(state, {
    rowDataIndexes: newRowDataIndexes,
    pagination: {
      ...prevPagination,
      currentPage,
      numberOfPages
    }
  });
};

const updateGridData = (state: GridState, {shouldUpdate, update}: UpdateGridDataPayload): GridState =>
  R.evolve({
    data: R.map(R.ifElse(shouldUpdate, update, R.identity))
  }, state);


// create reducer
const reducer = createReducer(
  initialGridState,
  on(GridActions.initGrid, initGridHandler),
  on(GridActions.updateSort, sortGridHandler),
  on(GridActions.updateFilters, filterGridHandler),
  on(GridActions.resetGridState, resetGridStateHandler),
  on(GridActions.changePageSize, changePageSizeHandler),
  on(GridActions.changePageNumber, changePageNumberHandler),
  on(GridActions.toggleRowSelection, toggleRowSelectionHandler),
  on(GridActions.toggleAllRowsSelection, toggleAllRowsSelectionHandler),
  on(GridActions.selectAllPages, selectAllPages),
  on(GridActions.selectCurrentPage, selectCurrentPage),
  on(GridActions.toggleColumnVisibility, toggleColumnVisibilityHandler),
  on(GridActions.updateGridData, updateGridData)
);

const rowIndexesAndPaginationReducer = createReducer(initialGridState, on(
  GridActions.initGrid,
  GridActions.updateSort,
  GridActions.updateFilters,
  GridActions.changePageSize,
  GridActions.changePageNumber,
  recalculateRowIndexesAndPagination
));

const isNgRxGridAction = R.startsWith('ngrx-data-grid');

export function gridReducer(state = initialState, action) {
  if (!isNgRxGridAction(action.type)) {
    return state;
  }

  const {name} = action;
  const gridState = state[name];
  const nextGridState = reducer(gridState, action);

  return R.mergeRight(state, {
    [name]: rowIndexesAndPaginationReducer(nextGridState, action)
  });
}
