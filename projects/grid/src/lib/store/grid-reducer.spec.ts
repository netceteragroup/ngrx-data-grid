import { reducer as gridReducer, GridState } from './grid-reducer';
import {
  changePageNumber,
  changePageSize, filterGrid,
  initGrid,
  sortGrid, toggleAllRowsSelection,
  toggleColumnVisibility, toggleRowSelection
} from '../actions/grid-actions';
import { ColumnConfig, FilteringOptions, FilterType, GridConfig, SortType } from '../config';

describe('GridReducer', () => {

  let state: GridState;

  const gridConfigExample: GridConfig = {
    visible: false,
    selection: {
      checkboxSelection: true,
      selectedRowsIds: [],
    },
    pagination: {
      paginationPageSize: 5,
      paginationPageSizeValues: [],
      enabled: false,
      currentPage: 0,
      numberOfPages: 2
    }
  };

  const initialState: GridState = {
    initialData: [],
    gridData: [],
    columnConfig: [],
    pagedData: [],
    gridConfig: {
      visible: true,
      selection: {
        checkboxSelection: false,
        selectedRowsIds: [],
      },
      pagination: {
        paginationPageSize: null,
        paginationPageSizeValues: [],
        enabled: false,
        currentPage: 0,
        numberOfPages: 0
      }
    }
  };

  const columnConfigExample: ColumnConfig[] = [
    {
      headerName: 'Header1',
      field: 'foo',
      component: null,
      isVisible: true,
      sortable: true,
      filter: {
        isFiltered: false,
        type: FilterType.NumberFilterType
      }
    },
    {
      headerName: 'Header2',
      field: 'bar',
      component: null,
      isVisible: false,
      sortable: false,
      filter: {
        isFiltered: false,
        type: FilterType.TextFilterType
      }
    }
  ];

  const multiSortData: Object[] = [
    {
      gridRowId: 0,
      f1: 2,
      f2: false,
      f3: 917
    },
    {
      gridRowId: 1,
      f1: 2,
      f2: false,
      f3: 997
    },
    {
      gridRowId: 2,
      f1: 2,
      f2: true,
      f3: 927
    },
    {
      gridRowId: 3,
      f1: 1,
      f2: true,
      f3: 997
    },
    {
      gridRowId: 4,
      f1: 1,
      f2: false,
      f3: 997
    },
    {
      gridRowId: 5,
      f1: 1,
      f2: false,
      f3: 999
    },
  ];

  const multiSortColumnConfig: ColumnConfig[] = [
    {
      headerName: 'head1',
      field: 'f1',
      component: null,
      isVisible: true,
      sortable: true,
      sortType: SortType.Descending,
      filter: {
        isFiltered: false,
        type: FilterType.NumberFilterType
      }
    },
    {
      headerName: 'head2',
      field: 'f2',
      component: null,
      isVisible: true,
      sortable: true,
      sortType: SortType.Descending,
      filter: {
        isFiltered: false,
        type: FilterType.TextFilterType
      }
    },
    {
      headerName: 'head3',
      field: 'f3',
      component: null,
      isVisible: true,
      sortable: true,
      sortType: SortType.Descending,
      filter: {
        isFiltered: false,
        type: FilterType.NumberFilterType
      }
    }
  ];

  const dataSortedByF2: Object[] = [
    {
      gridRowId: 2,
      f1: 2,
      f2: true,
      f3: 927
    },
    {
      gridRowId: 3,
      f1: 1,
      f2: true,
      f3: 997
    },
    {
      gridRowId: 0,
      f1: 2,
      f2: false,
      f3: 917
    },
    {
      gridRowId: 1,
      f1: 2,
      f2: false,
      f3: 997
    },
    {
      gridRowId: 4,
      f1: 1,
      f2: false,
      f3: 997
    },
    {
      gridRowId: 5,
      f1: 1,
      f2: false,
      f3: 999
    }
  ];

  const dataSortedByF3: Object[] = [
    {
      gridRowId: 5,
      f1: 1,
      f2: false,
      f3: 999
    },
    {
      gridRowId: 3,
      f1: 1,
      f2: true,
      f3: 997
    },
    {
      gridRowId: 1,
      f1: 2,
      f2: false,
      f3: 997
    },
    {
      gridRowId: 4,
      f1: 1,
      f2: false,
      f3: 997
    },
    {
      gridRowId: 2,
      f1: 2,
      f2: true,
      f3: 927
    },
    {
      gridRowId: 0,
      f1: 2,
      f2: false,
      f3: 917
    }
  ];

  const gridDataExample: Object[] = [
    {
      gridRowId: 0,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 1,
      foo: 3,
      bar: 'three'
    },
    {
      gridRowId: 2,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 3,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 4,
      foo: 3,
      bar: 'three'
    },
    {
      gridRowId: 5,
      foo: 2,
      bar: 'two'
    }
  ];

  const pagedDataExample = [
    {
      gridRowId: 0,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 1,
      foo: 3,
      bar: 'three'
    },
    {
      gridRowId: 2,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 3,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 4,
      foo: 3,
      bar: 'three'
    }
  ];

  const gridAscExample: Object[] = [
    {
      gridRowId: 3,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 0,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 5,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 2,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 4,
      foo: 3,
      bar: 'three'
    },
    {
      gridRowId: 1,
      foo: 3,
      bar: 'three'
    }
  ];

  const gridDescExample: Object[] = [
    {
      gridRowId: 1,
      foo: 3,
      bar: 'three'
    },
    {
      gridRowId: 4,
      foo: 3,
      bar: 'three'
    },
    {
      gridRowId: 2,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 5,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 0,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 3,
      foo: 1,
      bar: 'one'
    }
  ];

  const comparatorExample: Object[] = [
    {
      gridRowId: 0,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 3,
      foo: 1,
      bar: 'one'
    },
    {
      gridRowId: 2,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 5,
      foo: 2,
      bar: 'two'
    },
    {
      gridRowId: 1,
      foo: 3,
      bar: 'three'
    },
    {
      gridRowId: 4,
      foo: 3,
      bar: 'three'
    }
  ];

  const comparatorSort: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: false,
    sortable: true,
    comparator: (a, b) => a.foo - b.foo,
    sortType: SortType.Descending,
    filter: {
      isFiltered: false,
      type: FilterType.NumberFilterType
    }
  };

  const descConfig: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: true,
    sortable: true,
    sortType: SortType.Descending,
    filter: {
      isFiltered: false,
      type: FilterType.NumberFilterType
    }

  };

  const ascConfig: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: true,
    sortable: true,
    sortType: SortType.Ascending,
    filter: {
      isFiltered: false,
      type: FilterType.NumberFilterType
    }
  };

  const resetConfig: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: true,
    sortable: true,
    filter: {
      isFiltered: false,
      type: FilterType.NumberFilterType
    }
  };

  beforeEach(() => {
    const action = initGrid({initialData: gridDataExample, columnConfig: columnConfigExample, gridConfig: gridConfigExample});
    state = gridReducer(initialState, action);
  });

  it('should initiate the grid', () => {
    expect(state.initialData).toEqual(gridDataExample);
    expect(state.columnConfig).toEqual(columnConfigExample);
    expect(state.gridConfig).toEqual(gridConfigExample);
    expect(state.gridData).toEqual(gridDataExample);
    expect(state.pagedData).toEqual(pagedDataExample);
  });

  it('should change page size', () => {
    // given
    const action = changePageSize({pageSize: 1});

    // when
    state = gridReducer(state, action);

    // then
    expect(state.gridConfig.pagination.paginationPageSize).toEqual(1);
    expect(state.gridConfig.pagination.currentPage).toEqual(0);
    expect(state.gridConfig.pagination.numberOfPages).toEqual(6);
    expect(state.pagedData).toEqual([{
      gridRowId: 0,
      foo: 1,
      bar: 'one'
    }]);
  });

  it('should change page num', () => {
    // given
    const action = changePageNumber({pageNumber: 1});

    // when
    state = gridReducer(state, action);

    // then
    expect(state.gridConfig.pagination.currentPage).toEqual(1);
    expect(state.pagedData).toEqual([{
      gridRowId: 5,
      foo: 2,
      bar: 'two'
    }]);
  });

  it('should sort the grid', () => {
    // given
    const descending = sortGrid(descConfig);
    const ascending = sortGrid(ascConfig);
    const none = sortGrid(resetConfig);

    // when
    const desc = gridReducer(state, descending);
    const asc = gridReducer(desc, ascending);
    const reset = gridReducer(asc, none);

    // then
    expect(desc.gridData).toEqual(gridDescExample);
    expect(asc.gridData).toEqual(gridAscExample);
    expect(reset.gridData).toEqual(gridDataExample);
  });

  it('should sort multiple columns', () => {
    // given
    const multiSortInit = initGrid({initialData: multiSortData, columnConfig: multiSortColumnConfig, gridConfig: gridConfigExample});
    const sortByFirstFieldAction = sortGrid(multiSortColumnConfig[0]);
    const sortBySecondFieldAction = sortGrid(multiSortColumnConfig[1]);
    const sortByThirdFieldAction = sortGrid(multiSortColumnConfig[2]);

    // when
    const multiSortState = gridReducer(initialState, multiSortInit);
    const sortedByFirstFieldState = gridReducer(multiSortState, sortByFirstFieldAction);
    const sortedBySecondFieldState = gridReducer(sortedByFirstFieldState, sortBySecondFieldAction);
    const sortedByThridFieldState = gridReducer(sortedBySecondFieldState, sortByThirdFieldAction);

    // then
    expect(sortedByFirstFieldState.gridData).toEqual(multiSortData);
    expect(sortedBySecondFieldState.gridData).toEqual(dataSortedByF2);
    expect(sortedByThridFieldState.gridData).toEqual(dataSortedByF3);
  });

  it('should use comparator for sorting', () => {
    // given
    const sortAction = sortGrid(comparatorSort);

    // when
    const sort = gridReducer(state, sortAction);

    // then
    expect(sort.gridData).toEqual(comparatorExample);
  });

  it('should toggle column\'s visibility', () => {
    // given
    const toggleAction = toggleColumnVisibility({columnConfigIndex: 1});

    // when
    const toggleState = gridReducer(state, toggleAction);

    // then
    expect(toggleState.columnConfig[1].isVisible).toEqual(!state.columnConfig[1].isVisible);
  });

  it('should insert row/rows indexes in the selectedRowsIds array', () => {
    // given
    const index = 1;
    const oneRow = toggleRowSelection({rowId: 1});
    const allRows = toggleAllRowsSelection();

    // when
    const selectRowState = gridReducer(state, oneRow);
    const disselectRowState = gridReducer(selectRowState, oneRow);
    const selectAllRowsState = gridReducer(state, allRows);
    const disselectAllRowsState = gridReducer(selectAllRowsState, allRows);

    // then
    expect(selectRowState.gridConfig.selection.selectedRowsIds).toEqual([index]);
    expect(disselectRowState.gridConfig.selection.selectedRowsIds.length).toEqual(0);
    expect(selectAllRowsState.gridConfig.selection.selectedRowsIds.length).toEqual(6);
    expect(disselectAllRowsState.gridConfig.selection.selectedRowsIds.length).toEqual(0);
  });

  it('should filter data', () => {
    // given
    const actionLessThan = filterGrid({
      headerName: 'Header1',
      field: 'foo',
      component: null,
      isVisible: true,
      sortable: true,
      filter: {
        isFiltered: true,
        type: FilterType.NumberFilterType,
        condition: {
          filterValue: 2,
          filterKey: FilteringOptions.LessThanOrEqual
        }
      }
    });

    const actionContains = filterGrid({
      headerName: 'Header2',
      field: 'bar',
      component: null,
      isVisible: false,
      sortable: false,
      filter: {
        isFiltered: true,
        type: FilterType.TextFilterType,
        condition: {
          filterKey: FilteringOptions.Contains,
          filterValue: 'w'
        }
      }
    });

    // when
    const stateAfterFirstFilter = gridReducer(state, actionLessThan);
    const stateAfterSecondFilter = gridReducer(stateAfterFirstFilter, actionContains);

    // then
    expect(stateAfterFirstFilter.gridData).toEqual([
      {gridRowId: 0, foo: 1, bar: 'one'},
      {gridRowId: 2, foo: 2, bar: 'two'},
      {gridRowId: 3, foo: 1, bar: 'one'},
      {gridRowId: 5, foo: 2, bar: 'two'}]);

    expect(stateAfterSecondFilter.gridData).toEqual([
      {gridRowId: 2, foo: 2, bar: 'two'},
      {gridRowId: 5, foo: 2, bar: 'two'}
    ]);
  });

  it('should remove filter', () => {
    const removeFilterInit = initGrid({initialData: multiSortData, columnConfig: multiSortColumnConfig, gridConfig: gridConfigExample});

    const actionEquals = filterGrid({
      headerName: 'head1',
      field: 'f1',
      component: null,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.NumberFilterType,
        isFiltered: true,
        condition: {
          filterKey: FilteringOptions.Equals,
          filterValue: 2
        }
      }
    });

    const actionContains = filterGrid({
      headerName: 'head2',
      field: 'f2',
      component: null,
      isVisible: true,
      sortable: true,
      valueFormatter: (value) => value.toString(),
      filter: {
        type: FilterType.TextFilterType,
        isFiltered: true,
        condition: {
          filterKey: FilteringOptions.Contains,
          filterValue: 'se'
        }
      }
    });
    const actionLessThan = filterGrid({
        headerName: 'head3',
        field: 'f3',
        component: null,
        isVisible: true,
        sortable: true,
        filter: {
          type: FilterType.NumberFilterType,
          isFiltered: true,
          condition: {
            filterKey: FilteringOptions.LessThan,
            filterValue: 920
          }
        }
      }
    );

    const stateAfterInit = gridReducer(initialState, removeFilterInit);
    const stateAfterFirstFilter = gridReducer(stateAfterInit, actionEquals);
    const stateAfterSecondFilter = gridReducer(stateAfterFirstFilter, actionContains);
    const stateAfterThirdFilter = gridReducer(stateAfterSecondFilter, actionLessThan);

    expect(stateAfterThirdFilter.gridData).toEqual([{
      gridRowId: 0,
      f1: 2,
      f2: false,
      f3: 917
    }]);

    const removeLessThanFilter = filterGrid({
        headerName: 'head3',
        field: 'f3',
        component: null,
        isVisible: true,
        sortable: true,
        filter: {
          type: FilterType.NumberFilterType,
          isFiltered: false,
        }
      }
    );

    const stateAfterFilterRemoval = gridReducer(stateAfterThirdFilter, removeLessThanFilter);

    expect(stateAfterFilterRemoval.gridData).toEqual([{
      gridRowId: 0,
      f1: 2,
      f2: false,
      f3: 917
    }, {
      gridRowId: 1,
      f1: 2,
      f2: false,
      f3: 997
    }]);
  });
});
