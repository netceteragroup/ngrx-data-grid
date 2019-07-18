import { createAction, props } from '@ngrx/store';
import { InitGridPayload } from './init-grid-payload';
import { ColumnConfig } from '../config';

export enum GridActionTypes {
  InitGrid = 'ngrx-data-grid/InitGrid',
  SortGrid = 'ngrx-data-grid/SortGrid',
  ChangePageSize = 'ngrx-data-grid/ChangePageSize',
  ChangePageNumber = 'ngrx-data-grid/ChangePageNumber',
  ToggleRowSelection = 'ngrx-data-grid/ToggleRowSelection',
  ToggleSelectAllRows = 'ngrx-data-grid/ToggleSelectAllRows',
  FilterGrid = 'ngrx-data-grid/UpdateConfig',
  ToggleColumnVisibility = 'ngrx-data-grid/ToggleColumnVisibility'
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
