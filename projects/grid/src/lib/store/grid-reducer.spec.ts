import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { InitGridData, InitGridConfig, InitColumnConfig } from '@grid/store/grid-actions';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

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
    visable: false
  };
  const initialState: GridState = {
    gridData: [{
      empty: 'empty'
    }],
    columnConfig: [{
      component: null,
      field: 'empty',
      headerName: 'PCS Grid',
      isVisible: true
    }],
    gridConfig: { visable: true }
  };

  it('should return the initial state for no action', () => {
    // given
    const action = null;

    // when
    const result = gridReducer(undefined, action);

    // then
    expect(result).toEqual(initialState);
  });

  it('should initiate data of the grid', () => {
    // given
    const action = new InitGridData(gridDataExample);
    const state: GridState = {
      gridData: [
        {
          f1: 'a',
          f2: 'b'
        },
        {
          f3: 'c',
          f4: 'd'
        }
      ],
      columnConfig: [],
      gridConfig: { visable: true }
    };

    // when
    const empty = gridReducer(initialState, action);
    const data = gridReducer(state, action);

    // then
    expect(empty.gridData).toEqual(gridDataExample);
    expect(data.gridData).toEqual(gridDataExample);
  });

  it('should initiate the column config of the grid', () => {
    // given
    const action = new InitColumnConfig(columnConfigExample);
    const state: GridState = {
      gridData: [],
      columnConfig: [
        {
          headerName: 'Foo',
          field: 'foo',
          component: null,
          isVisible: true
        },
        {
          headerName: 'Bar',
          field: 'bar',
          component: null,
          isVisible: true
        }
      ],
      gridConfig: { visable: true }
    };

    // when
    const empty = gridReducer(initialState, action);
    const data = gridReducer(state, action);

    // then
    expect(empty.columnConfig).toEqual(columnConfigExample);
    expect(data.columnConfig).toEqual(columnConfigExample);
  });

  it('should initiate the config of the grid', () => {
    // given
    const action = new InitGridConfig(gridConfigExample);

    // when
    const result = gridReducer(initialState, action);

    // then
    expect(result.gridConfig).toEqual(gridConfigExample);
  });
});
