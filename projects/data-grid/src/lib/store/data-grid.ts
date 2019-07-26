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

export interface ParentGridState {
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

export const initialState: ParentGridState = {};

const initialGridState: GridState = {
  data: [],
  rowDataIndexes: [],
  selectedRowsIndexes: [],
  activeSorting: [],
  pagination: {
    enabled: true,
    paginationPageSize: null,
    paginationPageSizeValues: [5, 10, 20, 100],
    currentPage: 0,
    numberOfPages: 0
  },
  columns: []
};

const getGrid = (state: ParentGridState, gridName: string) => R.propOr(initialGridState, gridName)(state);

export const dataItemsWithIndexes: any = mapIndexed((val, idx) => {
  return {dataItem: val, dataItemIndex: idx};
});
export const getDataItem = R.prop('dataItem');
export const getDataItemIndex: any = R.prop('dataItemIndex');

const calculateRowDataIndexes = (gridState: GridState) => {
  const {data, activeSorting, columns} = gridState;

  const appliedSorting: any = R.map(columnId => {
    const column: DataGridColumnWithId = findDataGridColumnById(columnId, columns);
    return {sortType: columnSortType(column), valueResolver: columnValueResolver(column)};
  }, activeSorting);

  const appliedFilters = R.map(c => {
    const {filterType, condition} = columnFilter(c);
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

const initGridHandler = (state: ParentGridState, newState: InitGridPayload): ParentGridState => {
  const {name, data, columns, paginationPageSize} = newState;
  const grid: any = getGrid(state, name);

  // assign column id to columns
  const columnsWithIds = assignIdsToColumns(columns);

  const activeSorting = R.compose(R.map(getColumnId), R.filter(columnSortDefined))(columns);
  return R.merge(state, {
    [name]: {...grid, data, columns: columnsWithIds, activeSorting, pagination: {...grid.pagination, paginationPageSize}}
  });
};

const sortGridHandler = (state: ParentGridState, {name, columnId, sortType}: SortGridPayload): ParentGridState => {
  const grid: any = getGrid(state, name);
  const {activeSorting, columns}: GridState = grid;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.merge(column, {sortType}) : column;
  }, columns);

  // 1. remove if sort of this field is already applied
  const updatedSorting: any = R.filter(isNotEqual(columnId), activeSorting);
  // 2. add new/updated sort at the end
  return R.merge(state, {
    [name]: {...grid, columns: updatedColumns, activeSorting: hasValue(sortType) ? R.append(columnId, updatedSorting) : updatedSorting}
  });
};

const filterGridHandler = (state: ParentGridState, {name, columnId, condition}: FilterGridPayload): ParentGridState => {
  const grid: any = getGrid(state, name);
  const {columns}: GridState = grid;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.merge(column, {filter: R.merge(column.filter, {condition})}) : column;
  }, columns);

  return R.merge(state, {
    [name]: {...grid, columns: updatedColumns}
  });
};

const changePageSizeHandler = (state: ParentGridState, {name, pageSize}): ParentGridState => {
  const grid: any = getGrid(state, name);
  return R.merge(state, {
    [name]: {...grid, pagination: {...grid.pagination, paginationPageSize: pageSize}}
  });
};

const changePageNumberHandler = (state: ParentGridState, {name, pageNumber}): ParentGridState => {
  const grid: any = getGrid(state, name);
  return R.merge(state, {
    [name]: {...grid, pagination: {...grid.pagination, currentPage: pageNumber}}
  });
};

const toggleRowSelectionHandler = (state: ParentGridState, {name, dataItem}): ParentGridState => {
  const grid: any = getGrid(state, name);
  const {data, selectedRowsIndexes} = grid;

  const dataItemIndex = R.findIndex(R.equals(dataItem), data);
  const updateSelectionList = R.ifElse(R.contains(dataItemIndex), R.filter(isNotEqual(dataItemIndex)), R.append(dataItemIndex));

  return R.merge(state, {
    [name]: {...grid, selectedRowsIndexes: R.equals(-1, dataItemIndex) ? selectedRowsIndexes : updateSelectionList(selectedRowsIndexes)}
  });
};

const toggleAllRowsSelectionHandler = (state: ParentGridState, {name, selectionStatus}): ParentGridState => {
  const grid: any = getGrid(state, name);
  const {rowDataIndexes} = grid;

  const updatedSelectionList = isTrue(selectionStatus) ? rowDataIndexes : [];

  return R.merge(state, {
    [name]: {...grid, selectedRowsIndexes: updatedSelectionList}
  });
};

const toggleColumnVisibilityHandler = (state: ParentGridState, {name, columnId}): ParentGridState => {
  const grid: any = getGrid(state, name);
  const {columns}: GridState = grid;

  const updatedColumns = R.map(column => {
    return R.propEq('columnId', columnId)(column) ? R.merge(column, {visible: !column.visible}) : column;
  }, columns);

  return R.merge(state, {
    [name]: {...grid, columns: updatedColumns}
  });
};

// create reducer
const reducer = createReducer(
  initialState,
  on(GridActions.initGrid, initGridHandler),
  on(GridActions.updateSort, sortGridHandler),
  on(GridActions.updateFilters, filterGridHandler),
  on(GridActions.changePageSize, changePageSizeHandler),
  on(GridActions.changePageNumber, changePageNumberHandler),
  on(GridActions.toggleRowSelection, toggleRowSelectionHandler),
  on(GridActions.toggleAllRowsSelection, toggleAllRowsSelectionHandler),
  on(GridActions.toggleColumnVisibility, toggleColumnVisibilityHandler)
);

export const gridReducer = (state = initialState, action) => {
  const nextState = reducer(state, action);

  const {name} = action;

  const grid: any = getGrid(nextState, name);

  const rowDataIndexes = calculateRowDataIndexes(grid);

  return nextState !== state ? R.merge(nextState, {
    [name]: {
      ...grid, rowDataIndexes: rowDataIndexes, pagination: {
        ...grid.pagination,
        numberOfPages: calculateNumberOfPages(rowDataIndexes.length, grid.pagination.paginationPageSize)
      }
    }
  }) : state;
};
