import * as R from 'ramda';
import {PaginationConfig} from '../config';
import {createReducer, on} from '@ngrx/store';
import * as GridActions from '../actions/data-grid-actions';
import {calculateNumberOfPages, getPagedData} from './pagination-util';
import {applySorting} from './sorting-util';
import {hasNoValue, hasValue, isNotEqual, isTrue} from '../util/type';
import {
  AddRowPayload,
  DeleteRowByIndexPayload,
  DeleteRowWherePayload,
  FilterGridPayload,
  InitGridPayload,
  ReorderColumnPayload,
  ResizeColumnPayload,
  SortGridPayload,
  ToggleDetailsGridPayload,
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
import {applyFilters, getAppliedFilters} from './filters-util';
import {isCheckboxSelection} from '../util/selection';
import {getNumberOfHiddenColumnsBeforeIndex, getVisibleColumns, updateColumnWidth} from '../util/grid-columns';

export interface NgRxGridState {
  [key: string]: GridState;
}

export interface GridState<T extends object = object> {
  data: T[];
  rowDataIndexes: number[];
  selectedRowsIndexes: number[];
  children: string[];
  activeSorting: string[]; // column ids (order is important)
  pagination: PaginationConfig;
  columns: DataGridColumnWithId[];
  allSelected: boolean;
  allPagesSelected: boolean;
  currentPageSelected: boolean;
  parent: string;
  name: string;
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
  children: [],
  activeSorting: [],
  pagination: initialPagination,
  columns: [],
  allSelected: false,
  allPagesSelected: false,
  currentPageSelected: false,
  parent: null,
  name: null
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

type GetChildren = (state: GridState) => string[];
export const getChildren: GetChildren = R.propOr([], 'children');

type GetCurrentPageIndexes = (state: GridState) => number[];
const getCurrentPageIndexes: GetCurrentPageIndexes = (state: GridState) => {
  const {rowDataIndexes, pagination} = state;
  const {currentPage, paginationPageSize} = pagination;
  return  getPagedData(rowDataIndexes, currentPage, paginationPageSize);
};

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
  const {data, columns, paginationPageSize, parent, name} = newState;
  const activeSorting = R.compose(R.map(getColumnId), R.filter(columnSortDefined))(columns) as string[];

  return R.mergeRight(initialGridState, {
    data,
    columns,
    activeSorting,
    parent,
    name,
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

const currentPageContainsSelectedRows = (state: GridState): boolean => {
  const intersectionElements = R.intersection(getCurrentPageIndexes(state), getSelectedRowIndexes(state));
  return R.equals(intersectionElements, getCurrentPageIndexes(state));
};

const currentPageEqualsSelectedRows = (state: GridState): boolean => {
  const intersectionElements = R.intersection(getCurrentPageIndexes(state), getSelectedRowIndexes(state));
  return R.equals(intersectionElements, getCurrentPageIndexes(state))
    && R.equals(R.length(getSelectedRowIndexes(state)), R.length(intersectionElements));
};

const hasCustomSelection = (state: GridState): boolean => {
  return R.gt(R.length(getSelectedRowIndexes(state)), R.length(getCurrentPageIndexes(state)));
};

const isCurrentPageSelected = (state: GridState) => R.cond([
    [currentPageEqualsSelectedRows, R.always(true)],
    [hasCustomSelection, currentPageContainsSelectedRows],
    [R.T, R.always(false)]
  ])(state);

const changePageSizeHandler = (state: GridState, {pageSize}): GridState => R.mergeRight(state, {
  pagination: {...state.pagination, paginationPageSize: pageSize}
});

const handleCurrentPage = (state: GridState) => R.mergeRight(state, {
   currentPageSelected: !getAllPagesSelected(state) ? isCurrentPageSelected(state) : false,
   allSelected: currentPageContainsSelectedRows(state)
  });

const changePageNumberHandler = (state: GridState, {pageNumber}): GridState => R.mergeRight(state, {
  pagination: {...state.pagination, currentPage: pageNumber}
});

const toggleRadioSelection = (state: GridState, dataItemIndex: number): GridState => R.mergeRight(state, {
    selectedRowsIndexes: [dataItemIndex]
  });

const toggleCheckboxSelection = (state: GridState, dataItemIndex: number): GridState => {
  const {selectedRowsIndexes} = state;
  const updateSelectionList = R.ifElse(R.includes(dataItemIndex), R.filter(isNotEqual(dataItemIndex)), R.append(dataItemIndex));

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

const toggleAllRowsOnCurrentPageSelectionHandler = (state: GridState, {selectionStatus}): GridState => {
  const updatedSelectionList = isTrue(selectionStatus)
    ? getCurrentPageIndexes(state)
    : [];

  return R.mergeRight(state, {
    selectedRowsIndexes: updatedSelectionList,
    allSelected: selectionStatus,
    allPagesSelected: false,
    currentPageSelected: selectionStatus
  });
};

const toggleColumnVisibilityHandler = (state: GridState, {columnId}): GridState => {
  const {columns} = state;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.mergeRight(column, {visible: !column.visible}) : column;
  }, columns);

  return R.mergeRight(state, {columns: updatedColumns});
};

const selectAllPages = (state: GridState): GridState => R.mergeRight(state, {
    selectedRowsIndexes: getRowDataIndexes(state),
    allPagesSelected: true,
    currentPageSelected: false
  });

const selectCurrentPage = (state: GridState): GridState => R.mergeRight(state, {
    selectedRowsIndexes: getCurrentPageIndexes(state),
    currentPageSelected: true,
    allPagesSelected: false
  });

const toggleDetailGrid = (state: GridState, {child, active}: ToggleDetailsGridPayload): GridState =>
  active
    ? R.evolve({
      children: R.filter(isNotEqual(child))
    }, state)
    : state;

const resolveDataItemIndex = (state: GridState, action: DeleteRowByIndexPayload | DeleteRowWherePayload<any>) => {
  const rowIndex = (action as DeleteRowByIndexPayload).rowIndex;
  if (hasValue(rowIndex) && !Number.isNaN(rowIndex)) {
    return rowIndex;
  } else if ((action as DeleteRowWherePayload<any>).where) {
    return R.findIndex(
      index => (action as DeleteRowWherePayload<any>).where(state.data[index]),
      state.rowDataIndexes
    );
  }
  return -1;
};

const validIndex = (state: GridState, index: number): boolean =>
  hasValue(index) && index > -1 && index < state.rowDataIndexes.length;

const deleteRow = (state: GridState, action: DeleteRowByIndexPayload | DeleteRowWherePayload<any>): GridState => {
  const dataItemIndex = resolveDataItemIndex(state, action);
  if (validIndex(state, dataItemIndex)) {
    return R.evolve({
      rowDataIndexes: R.remove(dataItemIndex, 1),
      data: R.remove(state.rowDataIndexes[dataItemIndex], 1)
    }, state);
  }
  return state;
};

const addRow = (state: GridState, action: AddRowPayload<any>): GridState => {
  if (!hasValue(action.row)) {
    return state;
  }

  return validIndex(state, action.index)
    ? R.evolve({
      data: R.insert(state.rowDataIndexes[action.index], action.row)
    }, state)
    : R.evolve({
      data: R.append(action.row)
    }, state);
};

const alignSelectedRowsIndexesWithRowDataIndexes = (state: GridState) => {
  const {rowDataIndexes} = state;
  return R.filter(index => R.includes(index, rowDataIndexes), getSelectedRowIndexes(state));
};

const calculateSelectedRowsIfCurrentPageSelected = (state: GridState) => {
  const filteredSelectedRows = alignSelectedRowsIndexesWithRowDataIndexes(state);

  return currentPageContainsSelectedRows(state)
  ? getCurrentPageIndexes(state) : R.uniq(R.concat(getCurrentPageIndexes(state), filteredSelectedRows));
};

const recalculateSelectedRowsIndexes = (state: GridState): GridState => R.mergeRight(state,{
    selectedRowsIndexes: R.cond([
      [R.propEq('allPagesSelected', true), getRowDataIndexes],
      [R.propEq('currentPageSelected', true), calculateSelectedRowsIfCurrentPageSelected],
      [R.T, alignSelectedRowsIndexesWithRowDataIndexes]
    ])(state)
  });

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

const updateGridRowsHandler = (state: GridState) => {
  return R.compose(recalculateSelectedRowsIndexes, recalculateRowIndexesAndPagination)(state);
};

const updateGridData = (state: GridState, {shouldUpdate, update}: UpdateGridDataPayload): GridState =>
  R.evolve({
    data: R.map(R.ifElse(shouldUpdate, update, R.identity))
  }, state);

const initDetailGrid = (state: NgRxGridState, {parent, name}: InitGridPayload) => {
  if (hasNoValue(parent)) {
    return state;
  }

  const updateChildren = R.ifElse(R.includes(name), R.filter(isNotEqual(name)), R.append(name));
  return R.evolve({
    [parent]: {
      children: updateChildren
    }
  }, state);
};

const removeDetailGrids = (state: NgRxGridState, {name}) => {
  const findNestedGridNames = R.compose(
    R.map(R.prop('name')),
    R.filter(R.propEq('parent', name)),
    R.values
  );

  return R.omit(findNestedGridNames(state), state);
};

const reorderColumn = (state: GridState, {previousIndex, currentIndex}: ReorderColumnPayload): GridState => {
  const visibleColumns: DataGridColumnWithId[] = getVisibleColumns(state.columns);
  const previousColumnIndex: number = R.indexOf(visibleColumns[previousIndex], state.columns);
  const currentColumnIndex: number = R.indexOf(visibleColumns[currentIndex], state.columns);
  const hiddenColumnsCount: number = getNumberOfHiddenColumnsBeforeIndex(currentColumnIndex, state.columns);

  return R.mergeRight(state, {
    columns: R.move(previousColumnIndex, currentIndex + hiddenColumnsCount, state.columns),
  });
};

const resizeColumn = (state: GridState, {columnId, width}: ResizeColumnPayload): GridState => {
  return R.mergeRight(state, {
    columns: updateColumnWidth(columnId, width, state.columns)
  });
};

// create reducer
const reducer = createReducer(
  initialGridState,
  on(GridActions.initGrid, initGridHandler),
  on(GridActions.updateSort, sortGridHandler),
  on(GridActions.updateFilters, filterGridHandler),
  on(GridActions.resetGridState, resetGridStateHandler),
  on(GridActions.changePageSize, changePageSizeHandler),
  on(GridActions.changePageNumber, R.compose(handleCurrentPage, changePageNumberHandler)),
  on(GridActions.toggleRowSelection, toggleRowSelectionHandler),
  on(GridActions.toggleAllRowsOnCurrentPageSelection, toggleAllRowsOnCurrentPageSelectionHandler),
  on(GridActions.selectAllPages, selectAllPages),
  on(GridActions.selectCurrentPage, selectCurrentPage),
  on(GridActions.toggleColumnVisibility, toggleColumnVisibilityHandler),
  on(GridActions.updateGridData, updateGridData),
  on(GridActions.toggleDetailGrid, toggleDetailGrid),
  on(GridActions.reorderColumn, reorderColumn),
  on(GridActions.resizeColumn, resizeColumn),
  on(GridActions.deleteRow, deleteRow),
  on(GridActions.addRow, addRow)
);

const rowIndexesAndPaginationReducer = createReducer(initialGridState, on(
  GridActions.initGrid,
  GridActions.updateSort,
  GridActions.updateFilters,
  GridActions.changePageSize,
  GridActions.changePageNumber,
  GridActions.deleteRow,
  GridActions.addRow,
  updateGridRowsHandler
));

const ngRxGridStateReducer = createReducer(
  initialState,
  on(GridActions.resetGridState, removeDetailGrids),
  on(GridActions.initGrid, initDetailGrid)
);

const isNgRxGridAction = R.startsWith('ngrx-data-grid');

export function gridReducer(state = initialState, action) {
  if (!isNgRxGridAction(action.type)) {
    return state;
  }

  const {name} = action;
  const nextState = ngRxGridStateReducer(state, action);
  const gridState = nextState[name];
  const nextGridState = reducer(gridState, action);

  return R.mergeRight(nextState, {
    [name]: rowIndexesAndPaginationReducer(nextGridState, action)
  });
}
