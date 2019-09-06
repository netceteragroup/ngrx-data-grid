import * as R from 'ramda';
import { PaginationConfig } from '../config';
import { createReducer, on } from '@ngrx/store';
import * as GridActions from '../actions/data-grid-actions';
import { calculateNumberOfPages } from './pagination-util';
import { applySorting } from './sorting-util';
import { hasValue, isNotEqual, isTrue, mapIndexed } from '../util/type';
import { applyFilters } from './filters-util';
import { FilterGridPayload, InitGridPayload, SortGridPayload } from '../actions/data-grid-payload';
import {
  assignIdsToColumns,
  columnFilter,
  columnSortDefined,
  columnSortType,
  columnValueResolver,
  DataGridColumnWithId,
  findDataGridColumnById,
  findDataGridColumnsWithFilters,
  getColumnId
} from '../models';

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
}

export const initialState: NgRxGridState = {};

const initialPagination: PaginationConfig = {
  enabled: true,
  paginationPageSize: null,
  paginationPageSizeValues: [5, 10, 20, 100],
  currentPage: 0,
  numberOfPages: 0
};

const initialGridState: GridState = {
  data: [],
  rowDataIndexes: [],
  selectedRowsIndexes: [],
  activeSorting: [],
  pagination: initialPagination,
  columns: []
};

// Selectors
type GetIndexes = (state: GridState) => number[];
export const getSelectedRowIndexes: GetIndexes = R.propOr([], 'selectedRowsIndexes');
export const getRowDataIndexes: GetIndexes = R.propOr([], 'rowDataIndexes');
export const getData = R.propOr([], 'data');

type GetColumns = (state: GridState) => DataGridColumnWithId[];
export const getColumns: GetColumns = R.prop('columns');

type GetPagination = (state: GridState) => PaginationConfig;
export const getPagination: GetPagination = R.propOr(initialPagination, 'pagination');

export const dataItemsWithIndexes: any = mapIndexed((val, idx) => {
  return {dataItem: val, dataItemIndex: idx};
});
export const getDataItem = R.prop('dataItem');
export const getDataItemIndex: any = R.prop('dataItemIndex');

const calculateRowDataIndexes = (gridState: GridState, filters) => {
  const {data, activeSorting, columns} = gridState;

  const appliedSorting: any = R.map(columnId => {
    const column: DataGridColumnWithId = findDataGridColumnById(columnId, columns);
    return {sortType: columnSortType(column), valueResolver: columnValueResolver(column)};
  }, activeSorting);


  const appliedFilters = R.map((c: DataGridColumnWithId) => {
    const {filterType, condition} = columnFilter(c);
    // get c.filter.name and the corresponding filter => filters[c.filter.name]
    return {filterType, condition, valueResolver: columnValueResolver(c)};
  })(findDataGridColumnsWithFilters(columns));


  const filteredAndSortedData = R.compose(applySorting(appliedSorting), applyFilters(appliedFilters))(data);

  const rowDataIndexes = R.map((dataItem) => {
    const findDataItem = R.compose(R.equals(dataItem), getDataItem);
    const dataItemWithIndex = R.find(findDataItem, dataItemsWithIndexes(data));
    return hasValue(dataItemWithIndex) ? getDataItemIndex(dataItemWithIndex) : null;
  }, filteredAndSortedData);

  return R.filter(hasValue, rowDataIndexes);
};

const initGridHandler = (state: GridState, newState: InitGridPayload): GridState => {
  const {data, columns, paginationPageSize} = newState;

  // assign column id to columns
  const columnsWithIds = assignIdsToColumns(columns);

  const activeSorting = R.compose(R.map(getColumnId), R.filter(columnSortDefined))(columns) as string[];

  return R.merge(state, {
    data,
    columns: columnsWithIds,
    activeSorting,
    pagination: {...state.pagination, paginationPageSize}
  });
};

const sortGridHandler = (state: GridState, {columnId, sortType}: SortGridPayload): GridState => {
  const {activeSorting, columns} = state;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.merge(column, {sortType}) : column;
  }, columns);

  // 1. remove if sort of this field is already applied
  const updatedSorting: any = R.filter(isNotEqual(columnId), activeSorting);
  // 2. add new/updated sort at the end
  return R.merge(state, {
    columns: updatedColumns,
    activeSorting: hasValue(sortType) ? R.append(columnId, updatedSorting) : updatedSorting
  });
};

const filterGridHandler = (state: GridState, {columnId, condition}: FilterGridPayload): GridState => {
  const {columns} = state;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.merge(column, {filter: R.merge(column.filter, {condition})}) : column;
  }, columns);

  return R.merge(state, {columns: updatedColumns});
};

const changePageSizeHandler = (state: GridState, {pageSize}): GridState => R.merge(state, {
  pagination: {...state.pagination, paginationPageSize: pageSize}
});

const changePageNumberHandler = (state: GridState, {pageNumber}): GridState => R.merge(state, {
  pagination: {...state.pagination, currentPage: pageNumber}
});

const toggleRowSelectionHandler = (state: GridState, {dataItem}): GridState => {
  const {data, selectedRowsIndexes} = state;

  const dataItemIndex = R.findIndex(R.equals(dataItem), data);
  const updateSelectionList = R.ifElse(R.contains(dataItemIndex), R.filter(isNotEqual(dataItemIndex)), R.append(dataItemIndex));

  return R.merge(state, {
    selectedRowsIndexes: R.equals(-1, dataItemIndex) ? selectedRowsIndexes : updateSelectionList(selectedRowsIndexes) as number[]
  });
};

const toggleAllRowsSelectionHandler = (state: GridState, {selectionStatus}): GridState => {
  const {rowDataIndexes} = state;

  const updatedSelectionList = isTrue(selectionStatus) ? rowDataIndexes : [];

  return R.merge(state, {selectedRowsIndexes: updatedSelectionList});
};

const toggleColumnVisibilityHandler = (state: GridState, {columnId}): GridState => {
  const {columns} = state;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.merge(column, {visible: !column.visible}) : column;
  }, columns);

  return R.merge(state, {columns: updatedColumns});
};

const recalculateRowIndexesAndPagination = (state: GridState, {filters}: any): any => {
  const newRowDataIndexes = calculateRowDataIndexes(state, filters);

  console.log('Filter in reducer by', filters);

  return R.merge(state, {
    rowDataIndexes: newRowDataIndexes,
    pagination: {
      ...state.pagination,
      numberOfPages: calculateNumberOfPages(newRowDataIndexes.length, state.pagination.paginationPageSize)
    }
  });
};

// create reducer
const reducer = createReducer(
  initialGridState,
  on(GridActions.initGrid, initGridHandler),
  on(GridActions.updateSort, sortGridHandler),
  on(GridActions.updateFilters, filterGridHandler),
  on(GridActions.changePageSize, changePageSizeHandler),
  on(GridActions.changePageNumber, changePageNumberHandler),
  on(GridActions.toggleRowSelection, toggleRowSelectionHandler),
  on(GridActions.toggleAllRowsSelection, toggleAllRowsSelectionHandler),
  on(GridActions.toggleColumnVisibility, toggleColumnVisibilityHandler)
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

export function gridReducer (state = initialState, action, filters?: any) {
  if (!isNgRxGridAction(action.type)) {
    return state;
  }

  const {name} = action;
  const gridState = state[name];
  const nextGridState = reducer(gridState, action);

  return R.merge(state, {
    [name]: rowIndexesAndPaginationReducer(nextGridState, {...action, filters} as any)
  });
}
