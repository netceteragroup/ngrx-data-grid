import * as R from 'ramda';
import { Action } from '@ngrx/store';

// accepts an existing state and an action and return a new state
export type Reducer<S, A extends Action> = (state: S, action?: A, ...params) => S;

// consists the action type and a handler fn for that action type
export interface ActionHandler<S, A extends Action> {
  actionType: string;
  handler: Reducer<S, A>;
}

export const createActionHandler = <S, A extends Action>(actionType: string, handler: Reducer<S, A>): ActionHandler<S, A> => ({
  actionType,
  handler
});

/**
 * Find the action handler with the same action type as the action.
 *
 * @param action action
 * @param handlers list of action handlers
 */
export const findActionHandlerForAction = <S, A extends Action>(action: Action, handlers: ActionHandler<S, A>[]): ActionHandler<S, A> =>
  R.find((handler: ActionHandler<S, A>) => action && handler.actionType === action.type, handlers);

/**
 * Return the handler fn from the action handler if the action handler exists.
 *
 * @param actionHandler action handler
 */
const getHandlerIfExists = <S, A extends Action>(actionHandler: ActionHandler<S, A>): Function =>
  actionHandler ? actionHandler.handler : R.identity;

/**
 * Find the handler fn for given action and action handlers.
 *
 * @param action action
 * @param handlers list of action handlers
 */
export const findHandlerForAction = <S, A extends Action>(action: Action, handlers: ActionHandler<S, A>[]) =>
  <Reducer<S, A>>R.compose(getHandlerIfExists, findActionHandlerForAction)(action, handlers);
