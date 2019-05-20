import * as R from 'ramda';
import { AddNewColumn, AddNewRow, GridExampleActionTypes } from '@example/actions/grid-example';
import { createActionHandler, findActionHandlerForAction, findHandlerForAction } from '@example/util/reducer';
import { GridExampleState } from '@example/reducers/grid-example';

describe('ReducerUtility', () => {

  it('should find appropriate action handler for given handlers and action', () => {
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

  it('should return undefined if no handler exists for the given action', () => {
    // given
    const addRowAction = new AddNewRow();
    const addColumnAction = new AddNewColumn();

    const addColumnHandler = createActionHandler(GridExampleActionTypes.AddNewColumn, R.identity);
    const handlers = [addColumnHandler];

    // when
    const rowHandler = findActionHandlerForAction(addRowAction, handlers);
    const columnHandler = findActionHandlerForAction(addColumnAction, handlers);

    // then
    expect(rowHandler).toBeUndefined();
    expect(columnHandler.actionType).toEqual(GridExampleActionTypes.AddNewColumn);
  });

  it('should return the handler fn for the given action', () => {
    // given
    const addRowAction = new AddNewRow();
    const addColumnAction = new AddNewColumn();
    const handlerFn = (state: GridExampleState) => state;

    const addColumnHandler = createActionHandler(GridExampleActionTypes.AddNewColumn, handlerFn);
    const addRowHandler = createActionHandler(GridExampleActionTypes.AddNewRow, handlerFn);
    const handlers = [addColumnHandler, addRowHandler];

    // when
    const rowHandler = findHandlerForAction(addRowAction, handlers);
    const columnHandler = findHandlerForAction(addColumnAction, handlers);

    // then
    expect(rowHandler).toEqual(handlerFn);
    expect(columnHandler).toEqual(handlerFn);
  });

});
