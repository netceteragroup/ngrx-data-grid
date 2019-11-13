import * as R from 'ramda';
import {
  changePageNumber,
  changePageSize,
  initGrid, resetGridState,
  toggleAllRowsSelection,
  toggleColumnVisibility,
  toggleRowSelection,
  updateFilters,
  updateGridData,
  updateSort,
  selectAllPages,
  selectCurrentPage
} from '../actions/data-grid-actions';
import { gridReducer, initialGridState, initialState } from './data-grid';
import {
  assignIdsToColumns,
  columnFilterDefined,
  columnSortType,
  filterApplied,
  FilteringOptions,
  FilterType,
  SortType
} from '../models';

const findByProp = (props) => R.path(props);
const getColumn: any = (id) => R.compose(R.find(R.propEq('columnId', id)), findByProp(['columns']));

describe('Data Grid reducer', () => {

  const data = [
    {id: 1, name: 'test', value: 20},
    {id: 2, name: 'test 12', value: 40},
    {id: 3, name: 'test 1', value: 10},
    {id: 4, name: 'test 4', value: 20},
    {id: 5, name: 'test 2', value: 50},
    {id: 6, name: 'test 1', value: 60},
    {id: 7, name: 'test', value: 40}
  ];

  const columns = [
    {field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true},
    {field: 'name', headerName: 'name', visible: true, sortAvailable: true, filterAvailable: true, filter: {filterType: FilterType.Text}},
    {field: 'value', headerName: 'value', visible: true, sortAvailable: true, filterAvailable: true}
  ];

  let state: any;

  beforeEach(() => {
    const action = initGrid({name: 'grid-1', data, columns, paginationPageSize: 5});
    state = gridReducer(initialState, action);
  });

  it('should initiate the grid', () => {

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    expect(findByProp(['data'])(grid1)).toEqual(data);
    expect(findByProp(['rowDataIndexes'])(grid1)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(findByProp(['columns'])(grid1)).toEqual(assignIdsToColumns(columns));
    expect(findByProp(['activeSorting'])(grid1)).toEqual([]);
    expect(findByProp(['pagination', 'paginationPageSize'])(grid1)).toEqual(5);
    expect(findByProp(['pagination', 'numberOfPages'])(grid1)).toEqual(2);

    const grid2 = R.prop('grid-2')(state);
    expect(grid2).toBeUndefined();
  });

  it('should change the page', () => {

    const action = changePageNumber({name: 'grid-1', pageNumber: 1});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    expect(findByProp(['pagination', 'currentPage'])(grid1)).toEqual(1);
  });

  it('should change the page size', () => {

    const action = changePageSize({name: 'grid-1', pageSize: 6});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    expect(findByProp(['pagination', 'paginationPageSize'])(grid1)).toEqual(6);
  });

  it('should toggle row selection', () => {
    // when row is selected
    let action = toggleRowSelection({name: 'grid-1', dataItem: R.head(data)});
    state = gridReducer(state, action);

    let grid1 = R.prop('grid-1')(state);
    // then
    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([0]);

    // when row is deselected
    action = toggleRowSelection({name: 'grid-1', dataItem: R.head(data)});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);
    // then
    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([]);
  });

  it('should select all rows', () => {
    const action = toggleAllRowsSelection({name: 'grid-1', selectionStatus: true});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('should deselect all rows', () => {
    const action = toggleAllRowsSelection({name: 'grid-1', selectionStatus: false});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([]);
  });

  it('should apply a filter on column: "name" ', () => {
    const columnId = 'name-1';
    const action = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.Contains, value: 'test'});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const column: any = getColumn(columnId)(grid1);
    expect(column).toBeDefined();

    expect(columnFilterDefined(column)).toBeTruthy();
    expect(filterApplied(column.filter)).toBeTruthy();
  });

  it('should remove already applied filter on column: "name" ', () => {
    let grid1 = R.prop('grid-1')(state);

    const columnId = 'name-1';
    const filter: any = {columnId, filterType: 'Text', option: FilteringOptions.Contains, value: 'test'};
    const columnsState = R.compose(R.map(c => {
      return R.propEq('columnId', columnId)(c) ? R.mergeRight(c, {filter}) : c;
    }), findByProp(['columns']))(grid1);

    state = R.mergeRight(state, {
      ['grid-1']: {...grid1, columns: columnsState}
    });

    const action = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.None, value: null});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const column: any = getColumn(columnId)(grid1);
    expect(column).toBeDefined();
    expect(column.filter).toBeDefined();
    expect(filterApplied(column.filter)).toBeFalsy();
  });

  it('should apply a sort on column: "name" ', () => {
    const columnId = 'name-1';
    const action = updateSort({name: 'grid-1', columnId, sortType: SortType.Ascending});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const activeSorting: any = findByProp(['activeSorting'])(grid1);
    expect(activeSorting.length).toEqual(1);
    expect(activeSorting[0]).toEqual(columnId);
    const column: any = getColumn(columnId)(grid1);
    expect(columnSortType(column)).toEqual(SortType.Ascending);
  });

  it('should remove already applied sorting on column: "name" ', () => {
    let grid1 = R.prop('grid-1')(state);
    const columnId = 'name-1';

    const columnsState = R.compose(R.map(c => {
      return R.propEq('columnId', columnId)(c) ? R.mergeRight(c, {sortType: SortType.Descending}) : c;
    }), findByProp(['columns']))(grid1);

    state = R.mergeRight(state, {
      ['grid-1']: {...grid1, columns: columnsState, activeSorting: [columnId]}
    });

    const action = updateSort({name: 'grid-1', columnId, sortType: null});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const activeSorting: any = findByProp(['activeSorting'])(grid1);
    expect(activeSorting.length).toEqual(0);
    const column: any = getColumn(columnId)(grid1);
    expect(columnSortType(column)).toBeNull();
  });

  it('should update visibility of column with id: "name-1" to false', () => {
    const action = toggleColumnVisibility({name: 'grid-1', columnId: 'name-1'});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const column: any = R.compose(R.find(R.propEq('columnId', 'name-1')), findByProp(['columns']))(grid1);
    expect(column).toBeDefined();
    expect(findByProp(['visible'])(column)).toBeFalsy();
  });

  it('should update visibility of column with id: "name-1" to true', () => {
    let grid1 = R.prop('grid-1')(state);
    const columnsState = R.compose(R.map(c => {
      return R.propEq('columnId', 'name-1')(c) ? R.mergeRight(c, {visible: false}) : c;
    }), findByProp(['columns']))(grid1);

    state = R.mergeRight(state, {
      ['grid-1']: {
        ...grid1, columns: columnsState
      }
    });

    const action = toggleColumnVisibility({name: 'grid-1', columnId: 'name-1'});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const column: any = R.compose(R.find(R.propEq('columnId', 'name-1')), findByProp(['columns']))(grid1);
    expect(column).toBeDefined();
    expect(findByProp(['visible'])(column)).toBeTruthy();
  });

  it('should update one element of the grid data', () => {
    const shouldUpdateFn = R.curry((gridId, gridElement) => gridElement.id === gridId);
    const updateFn = (gridElement) => ({...gridElement, name: 'updated test'});
    const action = updateGridData({name: 'grid-1', shouldUpdate: shouldUpdateFn(1), update: updateFn});
    const expectedData = R.update(0, {id: 1, name: 'updated test', value: 20}, data);

    const result = R.prop('grid-1')(gridReducer(state, action));

    expect(result.data).toEqual(expectedData);
  });

  it('should update more elements of the grid data', () => {
    const shouldUpdateFn = R.curry((gridId, gridElement) => gridElement.id === gridId || gridElement.id === gridId + 1);
    const updateFn = (gridElement) => ({...gridElement, name: 'updated test'});
    const action = updateGridData({name: 'grid-1', shouldUpdate: shouldUpdateFn(1), update: updateFn});
    const expectedData = R.compose(
      R.update(0, {id: 1, name: 'updated test', value: 20}),
      R.update(1, {id: 2, name: 'updated test', value: 40})
    )(data);

    const result = R.prop('grid-1')(gridReducer(state, action));

    expect(result.data).toEqual(expectedData);
  });

  it('should apply a custom sort on column: "value" ', () => {
    // given
    const comparator = ({value: x}, {value: y}) => {
      if (x === y) {
        return 0;
      }

      return x > y ? 1 : -1;
    };
    const currentColumns = [columns[0], columns[1], {...columns[2], comparator}];
    const currentState = {
      ...state,
      columns: currentColumns
    } as any;
    const columnId = 'value-2';
    const action = updateSort({name: 'grid-1', columnId, sortType: SortType.Ascending});

    // when
    const nextState = gridReducer(currentState, action);
    const result = R.prop('grid-1')(nextState);

    // then
    expect(result).toBeDefined();
    const activeSorting: any = findByProp(['activeSorting'])(result);
    expect(activeSorting.length).toEqual(1);
    expect(activeSorting[0]).toEqual(columnId);
    const column: any = getColumn(columnId)(result);
    expect(columnSortType(column)).toEqual(SortType.Ascending);
    expect(result.rowDataIndexes).toEqual([2, 0, 3, 1, 6, 4, 5]);

    // when
    const descAction = updateSort({name: 'grid-1', columnId, sortType: SortType.Descending});
    const nextState2 = gridReducer(currentState, descAction);
    const resultDesc = R.prop('grid-1')(nextState2);

    // then
    expect(resultDesc.rowDataIndexes).toEqual([5, 4, 1, 6, 0, 3, 2]);
  });

  it('should reset the state', () => {
    // given
    const action = resetGridState({name: 'grid-1'});

    // when
    const result = R.prop('grid-1')(gridReducer(state, action));

    // then
    expect(result).toEqual(initialGridState);
  });

  it('should select all rows', () => {
    // given
    const initAction = toggleAllRowsSelection({name: 'grid-1', selectionStatus: true});
    const currentState = gridReducer(state, initAction);
    const action = selectAllPages({name: 'grid-1'});

    // when
    const result = R.prop('grid-1')(gridReducer(currentState, action));

    // then
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('should select all rows only from the first page', () => {
    // given
    const initAction = toggleAllRowsSelection({name: 'grid-1', selectionStatus: true});
    const currentState = gridReducer(state, initAction);
    const action = selectCurrentPage({name: 'grid-1'});

    // when
    const result = R.prop('grid-1')(gridReducer(currentState, action));

    // then
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4]);
  });

  it('should select all rows only from the last page', () => {
    // given
    const initAction = toggleAllRowsSelection({name: 'grid-1', selectionStatus: true});
    const nextState = gridReducer(state, initAction);
    const initPageAction = changePageNumber({name: 'grid-1', pageNumber: 1});
    const currentState = gridReducer(nextState, initPageAction);
    const action = selectCurrentPage({name: 'grid-1'});

    // when
    const result = R.prop('grid-1')(gridReducer(currentState, action));

    // then
    expect(result.selectedRowsIndexes).toEqual([5, 6]);
  });

});
