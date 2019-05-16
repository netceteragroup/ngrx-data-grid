import * as R from 'ramda';
import { AddNewColumn, AddNewRow, GridExampleActionTypes } from '@example/actions/grid-example';
import { createActionHandler, findActionHandlerForAction } from '@example/util/reducer';

describe('ReducerUtility', () => {

  it('should find appropriate handler for given handlers and action', () => {
    // given
    const addRowAction = new AddNewRow();
    const addColumnAction = new AddNewColumn();

    const addColumnHandler = createActionHandler(GridExampleActionTypes.AddNewColumn, R.identity);
    const addRowHandler = createActionHandler(GridExampleActionTypes.AddNewRow, R.identity);
    const handlers = [addColumnHandler, addRowHandler];

    // when
    const rowHandler = findActionHandlerForAction(addRowAction, handlers);
    const columnHandler = findActionHandlerForAction(addColumnAction, handlers);

    // then
    expect(rowHandler.actionType).toEqual(GridExampleActionTypes.AddNewRow);
    expect(columnHandler.actionType).toEqual(GridExampleActionTypes.AddNewColumn);
  });

});
