import { NgRxGridState, gridReducer } from 'ngrx-data-grid';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

export interface State {
  gridDemo: NgRxGridState;
}

export const reducers: ActionReducerMap<State> = {
  gridDemo: gridReducer
};

export const getGridState = createFeatureSelector<NgRxGridState>('gridDemo');
