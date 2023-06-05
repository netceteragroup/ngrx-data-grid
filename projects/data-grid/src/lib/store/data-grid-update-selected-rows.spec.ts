import {
  addRow,
  changePageNumber, changePageSize,
  initGrid, selectAllPages,
  selectCurrentPage,
  toggleAllRowsOnCurrentPageSelection, toggleRowSelection, updateFilters
} from "../actions/data-grid-actions";
import {gridReducer, initialState} from "./data-grid";
import {columns, data} from "./data-grid.spec";
import {FilteringOptions} from "../models";
import {SelectionType} from "../config";
import * as R from 'ramda';

describe('Data grid recalculate selected rows indexes', () => {
  let state: any;

  beforeEach(() => {
    const action = initGrid({name: 'grid-1', data, columns, paginationPageSize: 5});
    state = gridReducer(initialState, action);
  });

  it('should recalculate selected rows indexes when filter is cleared and all rows from current page are selected', () => {
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
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2 ,3, 4]);
    expect(result.currentPageSelected).toEqual(true);
    expect(result.allSelected).toEqual(true);
  });


  it('should recalculate selected rows indexes when filter is applied and all pages are selected', () => {
    // given
    const currentState = gridReducer(state, selectAllPages({name: 'grid-1'}));
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

  it('should recalculate selected rows indexes when update filter is applied and all rows from current page are selected', () => {
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

  it(`should recalculate selected rows indexes when current page is selected,
   filter is applied and selection is made from second page`, () => {
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

  it('should select newly added row when all rows from current page are selected', () => {
    //given
    let changePageSizeAction = changePageSize({name: 'grid-1', pageSize: 8});
    let currentState = gridReducer(state, changePageSizeAction);
    currentState = gridReducer(currentState, selectCurrentPage({name: 'grid-1'}));
    let addRowAction = addRow( {name: 'grid-1', row: {id: 8, name: 'test 15', value: 40}, index: 7});

    //when
    const resultState = gridReducer(currentState, addRowAction);

    //then
    const result = R.prop('grid-1')(resultState);
    expect(result.selectedRowsIndexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });
})
