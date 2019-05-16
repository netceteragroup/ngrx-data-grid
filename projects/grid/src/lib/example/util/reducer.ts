import * as R from 'ramda';
import { Action } from '@ngrx/store';

export type Reducer<S, A extends Action> = (state: S, action: A, ...params) => S;

export interface ActionHandler<S, A extends Action> {
  actionType: string;
  handler: Reducer<S, A>;
}

export const createActionHandler = <S, A extends Action>(actionType: string, handler: Reducer<S, A>): ActionHandler<S, A> => ({
  actionType,
  handler
});

export const findActionHandlerForAction = <S, A extends Action>(action: Action, handlers: ActionHandler<S, A>[]): ActionHandler<S, A> =>
  R.find((handler: ActionHandler<S, A>) => action && handler.actionType === action.type, handlers);

const getHandlerIfExists = <S, A extends Action>(actionHandler: ActionHandler<S, A>): Function =>
  actionHandler ? actionHandler.handler : R.identity;

export const findHandlerForAction = <S, A extends Action>(action: Action, handlers: ActionHandler<S, A>[]): Function =>
  R.compose(getHandlerIfExists, findActionHandlerForAction)(action, handlers);
