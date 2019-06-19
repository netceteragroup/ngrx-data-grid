import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { InitGrid, SortGrid } from '@grid/actions/grid-actions';
import { ColumnConfig, SortType } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

describe('GridReducer', () => {

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

  it('should sort the grid', () => {
    // given
    const initiate = new InitGrid(gridDataExample, columnConfigExample, gridConfigExample);

    // when
    const init = gridReducer(initialState, initiate);
    const desc = gridReducer(init, new SortGrid(descConfig));
    const asc = gridReducer(desc, new SortGrid(ascConfig));
    const reset = gridReducer(asc, new SortGrid(resetConfig));

    // then
    expect(desc.gridData).toEqual([gridDataExample[1], gridDataExample[2], gridDataExample[0]]);
    expect(asc.gridData).toEqual([gridDataExample[0], gridDataExample[2], gridDataExample[1]]);
    expect(reset.gridData).toEqual(init.gridData);
  });

});
