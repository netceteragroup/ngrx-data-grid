import * as R from 'ramda';
import {PaginationConfig} from '../config';
import {createReducer, on} from '@ngrx/store';
import * as GridActions from '../actions/data-grid-actions';
import {calculateNumberOfPages} from './pagination-util';
import {applySorting} from './sorting-util';
import {hasValue, isNotEqual, isTrue, mapIndexed} from '../util/type';
import {applyFilters, filterWithCondition} from './filters-util';
import {InitGridPayload} from '../actions/data-grid-payload';
import {DataFilter} from '../models/grid-filter';
import {DataItemSort} from '../models/grid-sort';

export interface ParentGridState {
  [key: string]: GridState;
}

export interface GridState<T extends object = object> {
  data: T[];
  rowDataIndexes: number[];
  selectedRowsIndexes: number[];
  activeFilters: DataFilter[];
  activeSorting: DataItemSort[];
  pagination: PaginationConfig;
}

const initialState: ParentGridState = {};

const initialGridState: GridState = {
  data: [],
  rowDataIndexes: [],
  selectedRowsIndexes: [],
  activeFilters: [],
  activeSorting: [],
  pagination: {
    enabled: true,
    paginationPageSize: null,
    paginationPageSizeValues: [5, 10, 20, 100],
    currentPage: 0,
    numberOfPages: 0
  }
};

const getGrid = (state: ParentGridState, gridName: string) => R.propOr(initialGridState, gridName)(state);

export const dataItemsWithIndexes: any = mapIndexed((val, idx) => {
  return {dataItem: val, dataItemIndex: idx};
});
export const getDataItem = R.prop('dataItem');
export const getDataItemIndex: any = R.prop('dataItemIndex');

const calculateRowDataIndexes = (gridState: GridState) => {
  const {data, activeFilters, activeSorting} = gridState;

  const filteredAndSortedData = R.compose(applySorting(activeSorting), applyFilters(activeFilters))(data);

  const rowDataIndexes = R.map((dataItem) => {
    const findDataItem = R.compose(R.equals(dataItem), getDataItem);
    const dataItemWithIndex = R.find(findDataItem, dataItemsWithIndexes(data));
    return hasValue(dataItemWithIndex) ? getDataItemIndex(dataItemWithIndex) : null;
  }, filteredAndSortedData);

  return R.filter(hasValue, rowDataIndexes);
};

const initGridHandler = (state: ParentGridState, newState: InitGridPayload): ParentGridState => {
  const {name: key, data, activeFilters, activeSorting, paginationPageSize} = newState;
  const grid: any = getGrid(state, key);
  return R.merge(state, {
    [key]: {...grid, data, activeFilters, activeSorting, pagination: {...grid.pagination, paginationPageSize}}
  });
};

const sortGridHandler = (state: ParentGridState, {name, sorting}): ParentGridState => {
  const {field, sortType} = sorting;

  const grid: any = getGrid(state, name);
  const {activeSorting} = grid;
  const filterBy = R.propEq('field', field);

  // 1. remove if sort of this field is already applied
  const updatedSorting = R.filter(R.compose(R.not, filterBy), activeSorting);
  // 2. add new/updated sort at the end
  return R.merge(state, {
    [name]: {...grid, activeSorting: hasValue(sortType) ? R.append(sorting, updatedSorting) : updatedSorting}
  });
};

const filterGridHandler = (state: ParentGridState, {name, filter}): ParentGridState => {
  const grid: any = getGrid(state, name);
  const {activeFilters} = grid;
  const {field} = filter;
  const filterBy = R.propEq('field', field);

  // 1. remove if filter of this field is already applied
  const updatedFilters = R.filter(R.compose(R.not, filterBy), activeFilters);

  return R.merge(state, {
    [name]: {...grid, activeFilters: filterWithCondition(filter) ? R.append(filter, updatedFilters) : updatedFilters}
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

// create reducer
const reducer = createReducer(
  initialState,
  on(GridActions.initGrid, initGridHandler),
  on(GridActions.updateSort, sortGridHandler),
  on(GridActions.updateFilters, filterGridHandler),
  on(GridActions.changePageSize, changePageSizeHandler),
  on(GridActions.changePageNumber, changePageNumberHandler),
  on(GridActions.toggleRowSelection, toggleRowSelectionHandler),
  on(GridActions.toggleAllRowsSelection, toggleAllRowsSelectionHandler)
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
