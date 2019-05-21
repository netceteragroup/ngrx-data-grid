import * as R from 'ramda';
import { createReducer, findActionHandlerForAction, findHandlerForAction } from '@grid/util/reducer';

describe('ReducerUtility', () => {

  it('should find appropriate action handler for given handlers and action', () => {
    // given
    const addColumnHandler = {
      actionType: 'AddColumn',
      handler: R.identity
    };
    const addRowHandler = {
      actionType: 'AddRow',
      handler: R.identity
    };
    const handlers = [addColumnHandler, addRowHandler];

    // when
    const rowHandler = findActionHandlerForAction({type: 'AddRow'}, handlers);
    const columnHandler = findActionHandlerForAction({type: 'AddColumn'}, handlers);

    // then
    expect(rowHandler.actionType).toEqual('AddRow');
    expect(columnHandler.actionType).toEqual('AddColumn');
  });

  it('should return undefined if no handler exists for the given action', () => {
    // given
    const addColumnHandler = {
      actionType: 'AddColumn',
      handler: R.identity
    };

    const handlers = [addColumnHandler];

    // when
    const rowHandler = findActionHandlerForAction({type: 'AddRow'}, handlers);
    const columnHandler = findActionHandlerForAction({type: 'AddColumn'}, handlers);

    // then
    expect(rowHandler).toBeUndefined();
    expect(columnHandler.actionType).toEqual('AddColumn');
  });

  it('should return the handler fn for the given action', () => {
    // given
    const handlerFn = (state: any) => state;
    const addColumnHandler = {
      actionType: 'AddColumn',
      handler: handlerFn
    };
    const addRowHandler = {
      actionType: 'AddRow',
      handler: handlerFn
    };
    const handlers = [addColumnHandler, addRowHandler];

    // when
    const rowHandler = findHandlerForAction({type: 'AddRow'}, handlers);
    const columnHandler = findHandlerForAction({type: 'AddColumn'}, handlers);

    // then
    expect(rowHandler).toEqual(handlerFn);
    expect(columnHandler).toEqual(handlerFn);
  });

  it('should create a reducer', () => {
    // given
    const initialState = {
      rowsNum: 0
    };
    const addRowHandler = {
      actionType: 'AddRow',
      handler: (state) => ({rowsNum: state.rowsNum + 1})
    };
    const expectedState = {
      rowsNum: 1
    };

    // when
    const reducer = createReducer([addRowHandler]);

    // then
    expect(reducer(initialState, {type: 'AddRow'})).toEqual(expectedState);
  });

});
