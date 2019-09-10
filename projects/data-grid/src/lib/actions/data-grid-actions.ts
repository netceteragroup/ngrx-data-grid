import {createAction, props} from '@ngrx/store';
import {
  ChangePageNumberPayload,
  ChangePageSizePayload,
  FilterGridPayload,
  InitGridPayload,
  SortGridPayload,
  ToggleAllRowsSelectionPayload,
  ToggleColumnVisibilityPayload,
  ToggleRowSelectionPayload
} from './data-grid-payload';
import { assignIdsToColumns } from '../models';

export enum GridActionTypes {
  InitGrid = 'ngrx-data-grid/InitGrid',
  UpdateSort = 'ngrx-data-grid/UpdateSort',
  UpdateFilters = 'ngrx-data-grid/UpdateFilters',
  ChangePageSize = 'ngrx-data-grid/ChangePageSize',
  ChangePageNumber = 'ngrx-data-grid/ChangePageNumber',
  ToggleRowSelection = 'ngrx-data-grid/ToggleRowSelection',
  ToggleAllRowsSelection = 'ngrx-data-grid/ToggleAllRowsSelection',
  ToggleColumnVisibility = 'ngrx-data-grid/ToggleColumnVisibility'
}

export const initGrid = createAction(
  GridActionTypes.InitGrid,
  ({columns, ...rest}: InitGridPayload) => ({
    columns: assignIdsToColumns(columns),
    ...rest
  })
);

export const updateSort = createAction(
  GridActionTypes.UpdateSort,
  props<SortGridPayload>()
);

export const updateFilters = createAction(
  GridActionTypes.UpdateFilters,
  props<FilterGridPayload>()
);

export const changePageSize = createAction(
  GridActionTypes.ChangePageSize,
  props<ChangePageSizePayload>()
);

export const changePageNumber = createAction(
  GridActionTypes.ChangePageNumber,
  props<ChangePageNumberPayload>()
);

export const toggleRowSelection = createAction(
  GridActionTypes.ToggleRowSelection,
  props<ToggleRowSelectionPayload>()
);

export const toggleAllRowsSelection = createAction(
  GridActionTypes.ToggleAllRowsSelection,
  props<ToggleAllRowsSelectionPayload>()
);


export const toggleColumnVisibility = createAction(
  GridActionTypes.ToggleColumnVisibility,
  props<ToggleColumnVisibilityPayload>()
);

