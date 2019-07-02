import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { ColumnConfig, SortType } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import { ChangePageNumber, ChangePageSize, FilterGrid, GridActions, InitGrid, SortGrid, ToggleColumnVisibility } from '@grid/actions/grid-actions';
import { FilteringOptions, FilterType } from '@grid/config/filter-config';

describe('GridReducer', () => {

  let state: GridState;
  let action: GridActions;

  const gridConfigExample: GridConfig = {
    visible: false,
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


  const gridDataExample: Object[] = [
    {
      foo: 1,
      bar: 'one',
    },
    {
      foo: 3,
      bar: 'three',
    },
    {
      foo: 2,
      bar: 'two',
    },
    {
      foo: 1,
      bar: 'one',
    },
    {
      foo: 3,
      bar: 'three',
    },
    {
      foo: 2,
      bar: 'two',
    }
  ];
  const multiSortData: Object[] = [
    {
      f1: 2,
      f2: false,
      f3: 917
    },
    {
      f1: 2,
      f2: false,
      f3: 997
    },
    {
      f1: 2,
      f2: true,
      f3: 927
    },
    {
      f1: 1,
      f2: true,
      f3: 997
    },
    {
      f1: 1,
      f2: false,
      f3: 997
    },
    {
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
      f1: 2,
      f2: true,
      f3: 927
    },
    {
      f1: 1,
      f2: true,
      f3: 997
    },
    {
      f1: 2,
      f2: false,
      f3: 917
    },
    {
      f1: 2,
      f2: false,
      f3: 997
    },
    {
      f1: 1,
      f2: false,
      f3: 997
    },
    {
      f1: 1,
      f2: false,
      f3: 999
    }
  ];

  const dataSortedByF3: Object[] = [
    {
      f1: 1,
      f2: false,
      f3: 999
    },
    {
      f1: 1,
      f2: true,
      f3: 997
    },
    {
      f1: 2,
      f2: false,
      f3: 997
    },
    {
      f1: 1,
      f2: false,
      f3: 997
    },
    {
      f1: 2,
      f2: true,
      f3: 927
    },

    {
      f1: 2,
      f2: false,
      f3: 917
    }
  ];

  const gridAscExample: Object[] = [
    {
      foo: 1,
      bar: 'one'
    },
    {
      foo: 1,
      bar: 'one'
    },
    {
      foo: 2,
      bar: 'two'
    },
    {
      foo: 2,
      bar: 'two'
    },
    {
      foo: 3,
      bar: 'three'
    },
    {
      foo: 3,
      bar: 'three'
    }
  ];

  const gridDescExample: Object[] = [
    {
      foo: 3,
      bar: 'three'
    },
    {
      foo: 3,
      bar: 'three'
    },
    {
      foo: 2,
      bar: 'two'
    },
    {
      foo: 2,
      bar: 'two'
    },
    {
      foo: 1,
      bar: 'one'
    },
    {
      foo: 1,
      bar: 'one'
    }
  ];

  const pagedDataExample = [
    {
      foo: 1,
      bar: 'one'
    },
    {
      foo: 3,
      bar: 'three'
    },
    {
      foo: 2,
      bar: 'two'
    },
    {
      foo: 1,
      bar: 'one'
    },
    {
      foo: 3,
      bar: 'three'
    }
  ];

  const comparatorExample: Object[] = [
    {
      foo: 1,
      bar: 'one'
    },
    {
      foo: 1,
      bar: 'one'
    },
    {
      foo: 2,
      bar: 'two'
    },
    {
      foo: 2,
      bar: 'two'
    },
    {
      foo: 3,
      bar: 'three'
    },
    {
      foo: 3,
      bar: 'three'
    }];

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
    action = new InitGrid({initialData: gridDataExample, columnConfig: columnConfigExample, gridConfig: gridConfigExample});
    state = gridReducer(initialState, action);
  });

  it('should return the initial state for no action', () => {
    // given
    action = null;

    // when
    const result = gridReducer(undefined, action);

    // then
    expect(result).toEqual(initialState);
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
    action = new ChangePageSize(1);

    // when
    state = gridReducer(state, action);

    // then
    expect(state.gridConfig.pagination.paginationPageSize).toEqual(1);
    expect(state.gridConfig.pagination.currentPage).toEqual(0);
    expect(state.gridConfig.pagination.numberOfPages).toEqual(6);
    expect(state.pagedData).toEqual([{
      foo: 1,
      bar: 'one'
    }]);
  });

  it('should change page num', () => {
    // given
    action = new ChangePageNumber(1);

    // when
    state = gridReducer(state, action);

    // then
    expect(state.gridConfig.pagination.currentPage).toEqual(1);
    expect(state.pagedData).toEqual([{
      foo: 2,
      bar: 'two'
    }]);
  });

  it('should sort the grid', () => {
    // given
    const descending = new SortGrid(descConfig);
    const ascending = new SortGrid(ascConfig);
    const none = new SortGrid(resetConfig);

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
    const multiSortInit = new InitGrid({initialData: multiSortData, columnConfig: multiSortColumnConfig, gridConfig: gridConfigExample});
    const sortByFirstFieldAction = new SortGrid(multiSortColumnConfig[0]);
    const sortBySecondFieldAction = new SortGrid(multiSortColumnConfig[1]);
    const sortByThirdFieldAction = new SortGrid(multiSortColumnConfig[2]);

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
    const sortAction = new SortGrid(comparatorSort);

    // when
    const sort = gridReducer(state, sortAction);

    // then
    expect(sort.gridData).toEqual(comparatorExample);
  });

  it('should toggle column\'s visibility', () => {
    // given
    const toggleAction = new ToggleColumnVisibility(1);

    // when
    const toggleState = gridReducer(state, toggleAction);

    // then
    expect(toggleState.columnConfig[1].isVisible).toEqual(!state.columnConfig[1].isVisible);
  });

  it('should filter data', () => {
    // given
    const actionLessThan = new FilterGrid({
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

    const actionContains = new FilterGrid({
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
      {foo: 1, bar: 'one'},
      {foo: 2, bar: 'two'},
      {foo: 1, bar: 'one'},
      {foo: 2, bar: 'two'}]);

    expect(stateAfterSecondFilter.gridData).toEqual([
      {foo: 2, bar: 'two'},
      {foo: 2, bar: 'two'}
    ]);
  });

  it('should remove filter', () => {
    const removeFilterInit = new InitGrid({initialData: multiSortData, columnConfig: multiSortColumnConfig, gridConfig: gridConfigExample});

    const actionEquals = new FilterGrid({
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

    const actionContains = new FilterGrid({
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
    const actionLessThan = new FilterGrid({
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
      f1: 2,
      f2: false,
      f3: 917
    }]);

    const removeLessThanFilter = new FilterGrid({
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
      f1: 2,
      f2: false,
      f3: 917
    }, {
      f1: 2,
      f2: false,
      f3: 997
    }]);
  });
});
