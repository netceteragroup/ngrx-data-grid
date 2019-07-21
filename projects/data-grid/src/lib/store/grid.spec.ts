import * as R from 'ramda';
import {changePageNumber, changePageSize, initGrid, toggleAllRowsSelection, toggleColumnVisibility, toggleRowSelection, updateFilters, updateSort} from '../actions/data-grid-actions';
import {gridReducer, initialState} from './grid';

const findByProp = (props) => R.path(props);

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
    {columnId: 'id-0', field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true},
    {columnId: 'name-1', field: 'name', headerName: 'name', visible: true, sortAvailable: true, filterAvailable: true},
    {columnId: 'value-2', field: 'value', headerName: 'value', visible: true, sortAvailable: true, filterAvailable: true}
  ];

  let state: any;

  beforeEach(() => {
    const action = initGrid({name: 'grid-1', data, activeFilters: [], activeSorting: [], columns, paginationPageSize: 5});
    state = gridReducer(initialState, action);
  });

  it('should initiate the grid', () => {

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    expect(findByProp(['data'])(grid1)).toEqual(data);
    expect(findByProp(['rowDataIndexes'])(grid1)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(findByProp(['columns'])(grid1)).toEqual(columns);
    expect(findByProp(['activeFilters'])(grid1)).toEqual([]);
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
    const filter: any = {filterType: 'Text', field: 'name', condition: {option: 'Contains', value: 'test'}};
    const action = updateFilters({name: 'grid-1', filter});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const activeFilters: any = findByProp(['activeFilters'])(grid1);
    expect(activeFilters.length).toEqual(1);
    expect(activeFilters[0]).toEqual(filter);
  });

  it('should remove already applied filter on column: "name" ', () => {
    let grid1 = R.prop('grid-1')(state);

    state = R.merge(state, {
      ['grid-1']: {
        ...grid1, activeFilters: [
          {filterType: 'Text', field: 'name', condition: {option: 'Contains', value: 'test1'}}
        ]
      }
    });

    const filter: any = {filterType: 'Text', field: 'name'};
    const action = updateFilters({name: 'grid-1', filter});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const activeFilters: any = findByProp(['activeFilters'])(grid1);

    expect(activeFilters.length).toEqual(0);
  });

  it('should apply a sort on column: "name" ', () => {
    const sorting: any = {field: 'name', sortType: 'ASC'};
    const action = updateSort({name: 'grid-1', sorting});
    state = gridReducer(state, action);

    const grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const activeSorting: any = findByProp(['activeSorting'])(grid1);
    expect(activeSorting.length).toEqual(1);
    expect(activeSorting[0]).toEqual(sorting);
  });

  it('should remove already applied sorting on column: "name" ', () => {
    let grid1 = R.prop('grid-1')(state);

    state = R.merge(state, {
      ['grid-1']: {
        ...grid1, activeSorting: [{field: 'name', sortType: 'DESC'}]
      }
    });

    const sorting = {field: 'name', sortType: null};
    const action = updateSort({name: 'grid-1', sorting});
    state = gridReducer(state, action);

    grid1 = R.prop('grid-1')(state);

    expect(grid1).toBeDefined();
    const activeSorting: any = findByProp(['activeSorting'])(grid1);
    expect(activeSorting.length).toEqual(0);
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
