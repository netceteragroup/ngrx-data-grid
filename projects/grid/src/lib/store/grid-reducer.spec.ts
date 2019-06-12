import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { InitGrid } from '@grid/actions/grid-actions';
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
    visible: false
  };
  const initialState: GridState = {
    initialData: [],
    gridData: [],
    columnConfig: [],
    gridConfig: { visible: true }
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
    const action = new InitGrid(gridDataExample, columnConfigExample, gridConfigExample);

    // when
    const state = gridReducer(initialState, action);

    // then
    expect(state.initialData).toEqual(gridDataExample);
    expect(state.columnConfig).toEqual(columnConfigExample);
    expect(state.gridConfig).toEqual(gridConfigExample);
    expect(state.gridData).toEqual(gridDataExample);
  });

});
