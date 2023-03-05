import * as R from 'ramda';
import {
  addRow,
  changePageNumber,
  changePageSize,
  deleteRow,
  initGrid,
  reorderColumn,
  resetGridState,
  resizeColumn,
  selectAllPages,
  selectCurrentPage,
  toggleAllRowsOnCurrentPageSelection,
  toggleColumnVisibility,
  toggleDetailGrid,
  toggleRowSelection,
  updateFilters,
  updateGridData,
  updateSort
} from '../actions/data-grid-actions';
import { gridReducer, initialGridState, initialState } from './data-grid';
import { assignIdsToColumns, columnFilterDefined, columnSortType, filterApplied, FilteringOptions, FilterType, SortType } from '../models';
import { SelectionType } from '../config';
import { getAppliedFilters } from './filters-util';
import {createAction, props} from "@ngrx/store";
import {ChangePageSizePayload} from "../actions/data-grid-payload";

const findByProp = (props) => R.path(props);
const getColumn: any = (id) => R.compose(R.find(R.propEq('columnId', id)), findByProp(['columns']));

describe('Data Grid reducer', () => {

  const data = [
    {id: 1, name: 'test', value: 20, nested: {name: 'test 0', value: 0}},
    {id: 2, name: 'test 12', value: 40, nested: {name: 'test 12.1', value: 20}},
    {id: 3, name: 'test 1', value: 10, nested: {name: 'test 1.1', value: 5}},
    {id: 4, name: 'test 4', value: 20, nested: {name: 'test 4.1', value: 10}},
    {id: 5, name: 'test 2', value: 50, nested: {name: 'test 2.1', value: 25}},
    {id: 6, name: 'test 11', value: 60, nested: { value: 30}},
    {id: 7, name: 'test 14', value: 40}
  ];

  const columns = [
    {field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true},
    {field: 'name', headerName: 'name', visible: true, sortAvailable: true, filterAvailable: true, filter: {filterType: FilterType.Text}, width: 200},
    {field: 'value', headerName: 'value', visible: true, sortAvailable: true, filterAvailable: true},
    {field: ['nested', 'name'], headerName: 'nested property name', visible: true, sortAvailable: true, filterAvailable: true,
      filter: {filterType: FilterType.Text}, width: 60}
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

  it('should toggle checkbox row selection', () => {
    // when row is selected
    let action = toggleRowSelection({name: 'grid-1', dataItem: R.head(data), selectionType: SelectionType.Checkbox});
    state = gridReducer(state, action);

    let grid1 = R.prop('grid-1')(state);
    // then
    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([0]);

    // when row is deselected
    action = toggleRowSelection({name: 'grid-1', dataItem: R.head(data), selectionType: SelectionType.Checkbox});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);
    // then
    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([]);
  });

  it('should toggle radio row selection', () => {
    // when row is selected
    let action = toggleRowSelection({name: 'grid-1', dataItem: data[0], selectionType: SelectionType.Radio});
    state = gridReducer(state, action);

    let grid1 = R.prop('grid-1')(state);
    // then
    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([0]);

    // when other row is selected
    action = toggleRowSelection({name: 'grid-1', dataItem: data[1], selectionType: SelectionType.Radio});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);
    // then
    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([1]);
  });

  it('should select all rows', () => {
    const action = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    expect(findByProp(['selectedRowsIndexes'])(grid1)).toEqual([0, 1, 2, 3, 4]);
  });

  it('should deselect all rows', () => {
    const action = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: false});
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

  it('should apply a filter on column: "nested-name" ', () => {
    const columnId = 'nested-name-3';
    const action = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.Contains, value: 'test'});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const column: any = getColumn(columnId)(grid1);
    expect(column).toBeDefined();

    expect(columnFilterDefined(column)).toBeTruthy();
    expect(filterApplied(column.filter)).toBeTruthy();
  });

  it('should apply a not contains filter on column: "nested-name" ', () => {
    const columnId = 'nested-name-3';
    const action = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.NotContains, value: 'test'});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const column: any = getColumn(columnId)(grid1);
    expect(column).toBeDefined();

    expect(columnFilterDefined(column)).toBeTruthy();
    expect(filterApplied(column.filter)).toBeTruthy();
    const notContainsFilter = getAppliedFilters(grid1.columns)[0];
    expect(notContainsFilter.rawValueResolver(data[0])).toEqual('test 0');
    expect(notContainsFilter.rawValueResolver(data[1])).toEqual('test 12.1');
    expect(notContainsFilter.rawValueResolver(data[2])).toEqual('test 1.1');
    expect(notContainsFilter.rawValueResolver(data[3])).toEqual('test 4.1');
    expect(notContainsFilter.rawValueResolver(data[4])).toEqual('test 2.1');
    expect(notContainsFilter.rawValueResolver(data[5])).toBeUndefined();
    expect(notContainsFilter.rawValueResolver(data[6])).toBeUndefined();
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
    const expectedData = R.update(0, {id: 1, name: 'updated test', value: 20, nested: {name: 'test 0', value: 0}}, data);

    const result = R.prop('grid-1')(gridReducer(state, action));

    expect(result.data).toEqual(expectedData);
  });

  it('should update more elements of the grid data', () => {
    const shouldUpdateFn = R.curry((gridId, gridElement) => gridElement.id === gridId || gridElement.id === gridId + 1);
    const updateFn = (gridElement) => ({...gridElement, name: 'updated test'});
    const action = updateGridData({name: 'grid-1', shouldUpdate: shouldUpdateFn(1), update: updateFn});
    const expectedData = R.compose(
      R.update(0, {id: 1, name: 'updated test', value: 20, nested: {name: 'test 0', value: 0}}),
      R.update(1, {id: 2, name: 'updated test', value: 40, nested: {name: 'test 12.1', value: 20}})
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
    const initAction = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true});
    const currentState = gridReducer(state, initAction);
    const action = selectAllPages({name: 'grid-1'});

    // when
    const result = R.prop('grid-1')(gridReducer(currentState, action));

    // then
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('should select all rows only from the first page', () => {
    // given
    const initAction = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true});
    const currentState = gridReducer(state, initAction);
    const action = selectCurrentPage({name: 'grid-1'});

    // when
    const result = R.prop('grid-1')(gridReducer(currentState, action));

    // then
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4]);
  });

  it('should select all rows only from the last page', () => {
    // given
    const initAction = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true});
    const nextState = gridReducer(state, initAction);
    const initPageAction = changePageNumber({name: 'grid-1', pageNumber: 1});
    const currentState = gridReducer(nextState, initPageAction);
    const action = selectCurrentPage({name: 'grid-1'});

    // when
    const result = R.prop('grid-1')(gridReducer(currentState, action));

    // then
    expect(result.selectedRowsIndexes).toEqual([5, 6]);
  });

  it('should close detail grid if it is already opened', () => {
    // given
    const action = toggleDetailGrid({name: 'grid-1', child: 'detail-grid-0', active: true});
    const currentState = {
      'grid-1': {
        ...state['grid-1'],
        children: ['detail-grid-0']
      }
    };

    // when
    const resultState = gridReducer(currentState, action);

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result).toBeDefined();
    expect(findByProp(['children'])(result)).toEqual([]);
  });

  it('should open detail grid', () => {
    // given
    const action = initGrid({name: 'detail-grid-0', parent: 'grid-1', paginationPageSize: 5, columns: [], data: []});
    const currentState = {
      'grid-1': {
        ...state['grid-1'],
        children: []
      }
    };
    const expected = ['detail-grid-0'];

    // when
    const resultState = gridReducer(currentState, action);

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result).toBeDefined();
    expect(findByProp(['children'])(result)).toEqual(expected);
  });

  it('should reorder the grid column', () => {
    // given
    const action = reorderColumn({name: 'grid-1', currentIndex: 0, previousIndex: 2});
    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1', 'columns'])(resultState);
    expect(result).toBeDefined();
    expect(result[0].field).toEqual('value');
    expect(result[1].field).toEqual('id');
    expect(result[2].field).toEqual('name');
  });

  it('should reorder the grid column before the hidden columns', () => {
    // given
    const action = reorderColumn({name: 'grid-1', currentIndex: 0, previousIndex: 3});
    const currentState = {
      'grid-1': {
        ...state['grid-1'],
        columns: [
          {field: 'col1', visible: true},
          {field: 'col2', visible: false},
          {field: 'col3', visible: false},
          {field: 'col4', visible: true},
          {field: 'col5', visible: true}
        ]
      }
    };
    // when
    const resultState = gridReducer(currentState, action);

    // then
    const result = R.path(['grid-1', 'columns'])(resultState);
    expect(result).toBeDefined();
    expect(result[0].field).toEqual('col5');
    expect(result[1].field).toEqual('col1');
    expect(result[2].field).toEqual('col2');
    expect(result[3].field).toEqual('col3');
    expect(result[4].field).toEqual('col4');
  });

  it('should reorder the grid column after the hidden columns', () => {
    // given
    const action = reorderColumn({name: 'grid-1', currentIndex: 1, previousIndex: 3});
    const currentState = {
      'grid-1': {
        ...state['grid-1'],
        columns: [
          {field: 'col1', visible: true},
          {field: 'col2', visible: false},
          {field: 'col3', visible: false},
          {field: 'col4', visible: true},
          {field: 'col5', visible: true}
        ]
      }
    };
    // when
    const resultState = gridReducer(currentState, action);

    // then
    const result = R.path(['grid-1', 'columns'])(resultState);
    expect(result).toBeDefined();
    expect(result[0].field).toEqual('col1');
    expect(result[1].field).toEqual('col2');
    expect(result[2].field).toEqual('col3');
    expect(result[3].field).toEqual('col5');
    expect(result[4].field).toEqual('col4');
  });

  it('should resize column when predefined width is null', () => {
    // given
    const width = 256;
    const action = resizeColumn({name: 'grid-1', columnId: 'id-0', width});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1', 'columns'])(resultState);
    expect(result[0].width).toEqual(width);
  });

  it('should resize column when width is defined in column definition', () => {
    // given
    const width = 256;

    const action = resizeColumn({name: 'grid-1', columnId: 'name-1', width});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1', 'columns'])(resultState);
    expect(result[1].width).toEqual(width);
  });

  it('should delete grid row for given index', () => {
    // given
    const action = deleteRow({name: 'grid-1', rowIndex: 0});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1', 'data'])(resultState);
    expect(result.length).toEqual(6);
    expect(result[0].id).toEqual(2);
  });

  it('should delete grid row for given predicate', () => {
    // given
    const action = deleteRow({name: 'grid-1', where: dataItem => dataItem.id === 2});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1', 'data'])(resultState);
    expect(result.length).toEqual(6);
    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(3);
  });

  it('should not update the grid if the row to be deleted does not exist', () => {
    // given
    const action = deleteRow({name: 'grid-1', where: dataItem => dataItem.id === 200});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1', 'data'])(resultState);
    expect(result.length).toEqual(7);
  });

  it('should not update the grid if the row index to be deleted does not exist', () => {
    // given
    const action = deleteRow({name: 'grid-1', rowIndex: 100});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1', 'data'])(resultState);
    expect(result.length).toEqual(7);
  });

  it('should add new row at the given position', () => {
    // given
    const action = addRow({name: 'grid-1', index: 1, row: {id: 50, name: 'new', value: 100}});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1'])(resultState);
    expect(result.data.length).toEqual(8);
    expect(result.data[1].id).toEqual(50);
  });

  it('should add new row at the end', () => {
    // given
    const action = addRow({name: 'grid-1', row: {id: 45}});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1'])(resultState);
    expect(result.data.length).toEqual(8);
    expect(result.data[7].id).toEqual(45);
    expect(result.rowDataIndexes[7]).toEqual(7);
  });

  it('should add the new row at the end if the new row index is bigger than the length of the data in the grid', () => {
    // given
    const action = addRow({name: 'grid-1', index: 9, row: {id: 45}});

    // when
    const resultState = gridReducer(state, action);

    // then
    const result = R.path(['grid-1'])(resultState);
    expect(result.data.length).toEqual(8);
    expect(result.data[7].id).toEqual(45);
  });

  it('should recalculate selected row indexes when update filter is dispatched and current page is selected', () => {
    // given
    const initAction = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true});
    const currentState = gridReducer(state, initAction);
    const columnId = 'name-1';
    const updateFilterAction = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.Contains, value: 'test 1'});

    // when
    const resultState = gridReducer(currentState, updateFilterAction);

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([1, 2, 5, 6])
    expect(result.currentPageSelected).toEqual(true);
    expect(result.allSelected).toEqual(true);
  });

  it('should select custom selection from second page', () => {
    // given
    const initAction = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true});
    let currentState = gridReducer(state, initAction);
    const columnId = 'name-1';
    const updateFilterAction = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.Contains, value: 'test'});
    currentState = gridReducer(currentState, updateFilterAction);
    const changePageNumberAction = changePageNumber({name: 'grid-1', pageNumber: 1})
    currentState = gridReducer(currentState, changePageNumberAction);
    const selectRow = toggleRowSelection({name: 'grid-1', dataItem: data[5], selectionType: SelectionType.Checkbox})

    // when
    const resultState = gridReducer(currentState, selectRow);

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4, 5]);
    expect(result.currentPageSelected).toEqual(false);
    expect(result.allSelected).toEqual(false);
  });

  it('should select custom selection from first page', () => {
    // given
    const initAction = changePageNumber({name: 'grid-1', pageNumber: 1})
    const selectCurrentPageAction = selectCurrentPage({name: 'grid-1'});
    let currentState = gridReducer(state, initAction);
    currentState = gridReducer(currentState, selectCurrentPageAction);
    currentState = gridReducer(currentState, changePageNumber({name: 'grid-1', pageNumber: 0}));
    const selectRow = toggleRowSelection({name: 'grid-1', dataItem: data[0], selectionType: SelectionType.Checkbox})

    // when
    const resultState = gridReducer(currentState, selectRow);

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([5, 6, 0]);
    expect(result.currentPageSelected).toEqual(false);
    expect(result.allSelected).toEqual(false);
  });

  it('should  recalculate selected rows when current page is changed', () => {
    // given
    const initAction = changePageNumber({name: 'grid-1', pageNumber: 1})
    const selectCurrentPageAction = selectCurrentPage({name: 'grid-1'});
    let currentState = gridReducer(state, initAction);
    currentState = gridReducer(currentState, selectCurrentPageAction);
    currentState = gridReducer(currentState, changePageNumber({name: 'grid-1', pageNumber: 0}));

    // when
    const resultState = gridReducer(currentState, toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true}));

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4]);
    expect(result.currentPageSelected).toEqual(true);
    expect(result.allSelected).toEqual(true);
  });

  it('should recalculate selected row indexes when update filter is dispatched and all are selected', () => {
    // given
    const initAction = selectAllPages({name: 'grid-1'});
    const currentState = gridReducer(state, initAction);
    const columnId = 'name-1';
    const updateFilterAction = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.Contains, value: 'test 1'});

    // when
    const resultState = gridReducer(currentState, updateFilterAction);

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([1, 2, 5, 6])
    expect(result.currentPageSelected).toEqual(false);
    expect(result.allPagesSelected).toEqual(true);
  });

  it('should recalculate selected row indexes when update filter is cleared and current page is selected', () => {
    // given
    const columnId = 'name-1';
    const updateFilterAction = updateFilters({name: 'grid-1', columnId, option: FilteringOptions.Contains, value: 'test 1'});
    const selectCurrentPage = toggleAllRowsOnCurrentPageSelection({name: 'grid-1', selectionStatus: true});
    let currentState = gridReducer(state, updateFilterAction);
    currentState = gridReducer(currentState, selectCurrentPage);
    currentState = gridReducer(currentState, changePageNumber({name: 'grid-1', pageNumber: 0}));
    // when
    const resultState = gridReducer(currentState, updateFilters({name: 'grid-1', columnId, option:FilteringOptions.None, value:null}));

    // then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2 ,3, 4, 5, 6]);
    expect(result.currentPageSelected).toEqual(true);
    expect(result.allSelected).toEqual(true);
  });

  it('should select newly added row if current page is selected', () => {
    //given
    let action = changePageSize({name: 'grid-1', pageSize: 10});
    let currentState = gridReducer(state, action);
    let initAction = selectCurrentPage({name: 'grid-1'});
    currentState = gridReducer(currentState, initAction);
    let addRowAction = addRow( {name: 'grid-1', row: {id: 8, name: 'test 15', value: 40}, index: 7});

    //when
    const resultState = gridReducer(currentState, addRowAction);

    //then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('should return previous state if empty row was added', () => {
    //given
    let initAction = changePageSize({name: 'grid-1', pageSize: 10});
    let currentState = gridReducer(state, initAction);
    let selectCurrentPageAction = selectCurrentPage({name: 'grid-1'});
    let previousState = gridReducer(currentState, selectCurrentPageAction);
    let addRowAction = addRow( {name: 'grid-1', row: {}, index: 7});

    //when
    const resultState = gridReducer(previousState, addRowAction);

    //then
    const result = R.prop('grid-1')(resultState);
    expect(resultState).toEqual(previousState);
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('should return previous state if invalid action was provided', () => {
    // given
    const changePageSizeAction = createAction(
      'invalidAction',
      props<ChangePageSizePayload>()
    );
    const initAction = changePageSizeAction({name: 'grid-1', pageSize: 10});
    const previousState = state;

    // when
    const resultState = gridReducer(previousState, initAction);

    // then
    expect(resultState).toEqual(previousState);
  });
});
