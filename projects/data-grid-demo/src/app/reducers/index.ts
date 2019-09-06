import { NgRxGridState, gridReducer } from 'ngrx-data-grid';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

export interface State {
  other: any;
}

export const reducers: ActionReducerMap<State> = {
  other: (s = 0, a) => s
};

export const getGridState = createFeatureSelector<NgRxGridState>('gridDemo');
