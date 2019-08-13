import { NgRxGridState, gridReducer } from 'ngrx-data-grid';
import { ActionReducerMap } from '@ngrx/store';

export interface State {
  gridDemo: NgRxGridState;
}

export const reducers: ActionReducerMap<State> = {
  gridDemo: gridReducer
};
