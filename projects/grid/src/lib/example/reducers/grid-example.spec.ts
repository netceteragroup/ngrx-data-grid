import { gridExampleReducer, GridExampleState } from '@example/reducers/grid-example';
import { AddNewColumn, AddNewRow } from '@example/actions/grid-example';

describe('GridExampleReducer', () => {

  it('should return the initial state for no action', () => {
    // given
    const action = null;
    const initialState: GridExampleState = {
      columnsNum: 0,
      rowsNum: 0
    };

    // when
    const result = gridExampleReducer(undefined, action);

    // then
    expect(result).toEqual(initialState);
  });

  it('should increment the row number of the grid', () => {
    // given
    const action = new AddNewRow();
    const state: GridExampleState = {
      columnsNum: 0,
      rowsNum: 0
    };

    // when
    const result = gridExampleReducer(state, action);

    // then
    expect(result.rowsNum).toEqual(1);
  });

  it('should increment the column number of the grid', () => {
    // given
    const action = new AddNewColumn();
    const state: GridExampleState = {
      columnsNum: 2,
      rowsNum: 2
    };

    // when
    const result = gridExampleReducer(state, action);

    // then
    expect(result.columnsNum).toEqual(3);
  });
});
