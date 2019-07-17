import { createAction, props } from '@ngrx/store';
import { InitGridPayload } from './init-grid-payload';
import { ColumnConfig } from '../config';

export enum GridActionTypes {
  InitGrid = '[Grid] Init Grid',
  SortGrid = '[Grid] Sort Grid',
  ChangePageSize = '[Grid] Change Page Size',
  ChangePageNumber = '[Grid] Change Page Number',
  ToggleRowSelection = '[Grid] Toggle Row Selection',
  ToggleSelectAllRows = '[Grid] Toggle Select All Rows',
  FilterGrid = '[Grid] Update Config',
  ToggleColumnVisibility = '[Grid] Toggle Column Visibility'
}

export const initGrid = createAction(
  GridActionTypes.InitGrid,
  props<InitGridPayload>()
);

export const sortGrid = createAction(
  GridActionTypes.SortGrid,
  props<ColumnConfig>()
);

export const changePageSize = createAction(
  GridActionTypes.ChangePageSize,
  props<{pageSize: number}>()
);

export const changePageNumber = createAction(
  GridActionTypes.ChangePageNumber,
  props<{pageNumber: number}>()
);

export const toggleColumnVisibility = createAction(
  GridActionTypes.ToggleColumnVisibility,
  props<{columnConfigIndex: number}>()
);

export const filterGrid = createAction(
  GridActionTypes.FilterGrid,
  props<ColumnConfig>()
);

export const toggleRowSelection = createAction(
  GridActionTypes.ToggleRowSelection,
  props<{rowId: number}>()
);

export const toggleAllRowsSelection = createAction(
  GridActionTypes.ToggleSelectAllRows
);
