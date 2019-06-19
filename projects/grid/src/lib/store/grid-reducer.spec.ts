import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { ColumnConfig, SortType } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import { ChangePageNumber, ChangePageSize, GridActions, InitGrid, SortGrid } from '@grid/actions/grid-actions';
import * as R from 'ramda';

describe('GridReducer', () => {

  let state: GridState;
  let action: GridActions;

  const gridDataExample: Object[] = [
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
    },
    {
      foo: 2,
      bar: 'two'
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
    },

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

  it('should use comparator for sorting', () => {
    // given
    const sortAction = new SortGrid(comparatorSort);

    // when
    const sort = gridReducer(state, sortAction);

    // then
    expect(sort.gridData).toEqual(comparatorExample);
  });
});
