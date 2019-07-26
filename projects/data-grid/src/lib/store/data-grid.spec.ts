import * as R from 'ramda';
import { changePageNumber, changePageSize, initGrid, toggleAllRowsSelection, toggleColumnVisibility, toggleRowSelection, updateFilters, updateSort } from '../actions/data-grid-actions';
import { gridReducer, initialState } from './data-grid';
import { assignIdsToColumns, columnFilterDefined, columnSortType, filterApplied, SortType } from '../models';

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
    {field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true, component: {}},
    {field: 'name', headerName: 'name', visible: true, sortAvailable: true, filterAvailable: true, component: {}},
    {field: 'value', headerName: 'value', visible: true, sortAvailable: true, filterAvailable: true, component: {}}
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
    const condition: any = {option: 'Contains', value: 'test'};
    const columnId = 'name-1';
    const action = updateFilters({name: 'grid-1', columnId, condition});
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
    const filter: any = {columnId, filterType: 'Text', condition: {option: 'Contains', value: 'test'}};
    const columnsState = R.compose(R.map(c => {
      return R.propEq('columnId', columnId)(c) ? R.merge(c, {filter}) : c;
    }), findByProp(['columns']))(grid1);

    state = R.merge(state, {
      ['grid-1']: {...grid1, columns: columnsState}
    });

    const action = updateFilters({name: 'grid-1', columnId, condition: null});
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
      return R.propEq('columnId', columnId)(c) ? R.merge(c, {sortType: SortType.Descending}) : c;
    }), findByProp(['columns']))(grid1);

    state = R.merge(state, {
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
      return R.propEq('columnId', 'name-1')(c) ? R.merge(c, {visible: false}) : c;
    }), findByProp(['columns']))(grid1);

    state = R.merge(state, {
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
});
