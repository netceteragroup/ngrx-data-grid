import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { ColumnConfig, SortType } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import { ChangePageNumber, ChangePageSize, GridActions, InitGrid, SortGrid, ToggleColumnVisibility, ToggleRowSelection, ToggleSelectAllRows } from '@grid/actions/grid-actions';
import * as R from 'ramda';

describe('GridReducer', () => {

  let state: GridState;
  let action: GridActions;

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
      sortType: SortType.Descending
    },
    {
      headerName: 'head2',
      field: 'f2',
      component: null,
      isVisible: true,
      sortable: true,
      sortType: SortType.Descending
    },
    {
      headerName: 'head3',
      field: 'f3',
      component: null,
      isVisible: true,
      sortable: true,
      sortType: SortType.Descending
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

  const columnConfigExample: ColumnConfig[] = [
    {
      headerName: 'Header1',
      field: 'foo',
      component: null,
      isVisible: true,
      sortable: true
    },
    {
      headerName: 'Header2',
      field: 'bar',
      component: null,
      isVisible: false,
      sortable: false
    }
  ];

  const comparatorSort: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: false,
    sortable: true,
    comparator: (a, b) => a.foo - b.foo,
    sortType: SortType.Descending
  };

  const descConfig: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: true,
    sortable: true,
    sortType: SortType.Descending
  };
  const ascConfig: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: true,
    sortable: true,
    sortType: SortType.Ascending
  };
  const resetConfig: ColumnConfig = {
    headerName: 'Header1',
    field: 'foo',
    component: null,
    isVisible: true,
    sortable: true
  };

  const gridConfigExample: GridConfig = {
    visible: false,
    checkboxSelection: false,
    selectedRowsIds: [],
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
      checkboxSelection: false,
      selectedRowsIds: [],
      pagination: {
        paginationPageSize: null,
        paginationPageSizeValues: [],
        enabled: false,
        currentPage: 0,
        numberOfPages: 0
      }
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
      gridRowId: 0,
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
      gridRowId: 5,
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

  it('should insert row/rows indexes in the selectedRowsIds array', () => {
    // given
    const index = 1;
    const oneRow = new ToggleRowSelection(index);
    const allRows = new ToggleSelectAllRows();

    // when
    const selectRowState = gridReducer(state, oneRow);
    const disselectRowState = gridReducer(selectRowState, oneRow);
    const selectAllRowsState = gridReducer(state, allRows);
    const disselectAllRowsState = gridReducer(selectAllRowsState, allRows);

    // then
    expect(selectRowState.gridConfig.selectedRowsIds).toEqual([index]);
    expect(disselectRowState.gridConfig.selectedRowsIds.length).toEqual(0);
    expect(selectAllRowsState.gridConfig.selectedRowsIds.length).toEqual(6);
    expect(disselectAllRowsState.gridConfig.selectedRowsIds.length).toEqual(0);
  });
});
