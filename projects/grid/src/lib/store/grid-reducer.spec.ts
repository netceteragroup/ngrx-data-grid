import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import { ChangePageNumber, ChangePageSize, GridActions, InitGrid } from '@grid/actions/grid-actions';

describe('GridReducer', () => {

  let state: GridState;
  let action: GridActions;

  const gridDataExample: Object[] = [
    {
      foo: 'one',
      bar: 'two'
    },
    {
      foo: 'test',
      bar: 'dat'
    },
    {
      foo: 'one',
      bar: 'two'
    },
    {
      foo: 'test',
      bar: 'dat'
    },
    {
      foo: 'one',
      bar: 'two'
    },
    {
      foo: 'test',
      bar: 'dat'
    }
  ];

  const pagedDataExample = [
    {
      foo: 'one',
      bar: 'two'
    },
    {
      foo: 'test',
      bar: 'dat'
    },
    {
      foo: 'one',
      bar: 'two'
    },
    {
      foo: 'test',
      bar: 'dat'
    },
    {
      foo: 'one',
      bar: 'two'
    }];

  const columnConfigExample: ColumnConfig[] = [
    {
      headerName: 'Header1',
      field: 'foo',
      component: null,
      isVisible: true
    },
    {
      headerName: 'Header2',
      field: 'bar',
      component: null,
      isVisible: false
    }
  ];

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
      foo: 'one',
      bar: 'two'
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
      foo: 'test',
      bar: 'dat'
    }]);
  });
});
