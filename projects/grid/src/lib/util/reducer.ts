import * as R from 'ramda';
import { Action } from '@ngrx/store';

// accepts an existing state and an action and return a new state
export type Reducer<S, A extends Action> = (state: S, action?: A, ...params) => S;

// consists the action type and a handler fn for that action type
export interface ActionHandler<S, A extends Action> {
  actionType: string;
  handler: Reducer<S, A>;
}

/**
 * Create action handler from the given action type and handler fn.
 *
 * @param actionType type of the action
 * @param handler handler fn
 * @return action handler
 */
export const createActionHandler = <S, A extends Action>(actionType: string, handler: Reducer<S, A>): ActionHandler<S, A> => ({
  actionType,
  handler
});

/**
 * Find the action handler with the same action type as the action.
 *
 * @param action action
 * @param handlers list of action handlers
 * @return action handler
 */
export const findActionHandlerForAction = <S, A extends Action>(action: Action, handlers: ActionHandler<S, A>[]): ActionHandler<S, A> =>
  R.find((handler: ActionHandler<S, A>) => action && handler.actionType === action.type, handlers);

/**
 * Return the handler fn from the action handler if the action handler exists.
 *
 * @param actionHandler action handler
 * @return handler if exists, identity fn instead
 */
const getHandlerIfExists = <S, A extends Action>(actionHandler: ActionHandler<S, A>): Function =>
  actionHandler ? actionHandler.handler : R.identity;

/**
 * Find the handler fn for given action and action handlers.
 *
 * @param action action
 * @param handlers list of action handlers
 * @return handler
 */
export const findHandlerForAction = <S, A extends Action>(action: Action, handlers: ActionHandler<S, A>[]) =>
  <Reducer<S, A>>R.compose(getHandlerIfExists, findActionHandlerForAction)(action, handlers);

/**
 * Create reducer for the given handlers and initial state.
 *
 * @param handlers action handlers
 * @param initialState initial state
 * @return reducer
 */
export const createReducer = <S, A extends Action>(handlers: ActionHandler<S, A>[], initialState?: S) =>
  (state: S = initialState, action: A): S => {
    const handler = findHandlerForAction(action, handlers);
    return handler(state, action);
  };
