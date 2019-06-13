import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import { InitGrid } from '@grid/actions/grid-actions';

describe('GridReducer', () => {

  const gridDataExample: Object[] = [
    {
      foo: 'one',
      bar: 'two'
    },
    {
      foo: 'test',
      bar: 'dat'
    }
  ];
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
      paginationPageSize: 0,
      paginationPageSizeValues: [],
      enabled: false,
      currentPage: 0
    }
  };
  const initialState: GridState = {
    initialData: [],
    gridData: [],
    columnConfig: [],
    gridConfig: {
      visible: true,
      pagination: {
        paginationPageSize: null,
        paginationPageSizeValues: [],
        enabled: false,
        currentPage: 0
      }
    }
  };

  it('should return the initial state for no action', () => {
    // given
    const action = null;

    // when
    const result = gridReducer(undefined, action);

    // then
    expect(result).toEqual(initialState);
  });

  it('should initiate the grid', () => {
    // given
    const action = new InitGrid({initialData: [...gridDataExample], columnConfig: [...columnConfigExample], gridConfig: {...gridConfigExample}});

    // when
    const state = gridReducer(initialState, action);

    // then
    expect(state.initialData).toEqual(gridDataExample);
    expect(state.columnConfig).toEqual(columnConfigExample);
    expect(state.gridConfig).toEqual(gridConfigExample);
    expect(state.gridData).toEqual(gridDataExample);
  });

});
