import { createAction, props } from '@ngrx/store';
import {
  AddRowPayload,
  BaseGridPayload,
  ChangePageNumberPayload,
  ChangePageSizePayload,
  DeleteRowByIndexPayload,
  DeleteRowWherePayload,
  FilterGridPayload,
  InitGridPayload,
  ReorderColumnPayload,
  ResizeColumnPayload,
  SortGridPayload,
  ToggleAllRowsOnCurrentPageSelectionPayload,
  ToggleColumnVisibilityPayload,
  ToggleDetailsGridPayload,
  ToggleRowSelectionPayload,
  UpdateGridDataPayload
} from './data-grid-payload';
import { assignIdsToColumns } from '../models';

export enum GridActionTypes {
  InitGrid = 'ngrx-data-grid/InitGrid',
  UpdateSort = 'ngrx-data-grid/UpdateSort',
  UpdateFilters = 'ngrx-data-grid/UpdateFilters',
  ChangePageSize = 'ngrx-data-grid/ChangePageSize',
  ChangePageNumber = 'ngrx-data-grid/ChangePageNumber',
  ToggleRowSelection = 'ngrx-data-grid/ToggleRowSelection',
  ToggleAllRowsOnCurrentPageSelection = 'ngrx-data-grid/ToggleAllRowsOnCurrentPageSelection',
  ToggleColumnVisibility = 'ngrx-data-grid/ToggleColumnVisibility',
  UpdateGridData = 'ngrx-data-grid/UpdateGridData',
  ResetGridState = 'ngrx-data-grid/ResetGridState',
  SelectAllPages = 'ngrx-data-grid/SelectAllPages',
  SelectCurrentPage = 'ngrx-data-grid/SelectCurrentPage',
  ToggleDetailGrid = 'ngrx-data-grid/ToggleDetailGrid',
  ReorderColumn = 'ngrx-data-grid/ReorderColumn',
  ResizeColumn = 'ngrx-data-grid/ResizeColumn',
  DeleteRow = 'ngrx-data-grid/DeleteRow',
  AddRow = 'ngrx-data-grid/AddRow'
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

export const toggleAllRowsOnCurrentPageSelection = createAction(
  GridActionTypes.ToggleAllRowsOnCurrentPageSelection,
  props<ToggleAllRowsOnCurrentPageSelectionPayload>()
);


export const toggleColumnVisibility = createAction(
  GridActionTypes.ToggleColumnVisibility,
  props<ToggleColumnVisibilityPayload>()
);

export const updateGridData = createAction(
  GridActionTypes.UpdateGridData,
  props<UpdateGridDataPayload>()
);

export const resetGridState = createAction(
  GridActionTypes.ResetGridState,
  props<BaseGridPayload>()
);

export const selectAllPages = createAction(
  GridActionTypes.SelectAllPages,
  props<BaseGridPayload>()
);

export const selectCurrentPage = createAction(
  GridActionTypes.SelectCurrentPage,
  props<BaseGridPayload>()
);

export const toggleDetailGrid = createAction(
  GridActionTypes.ToggleDetailGrid,
  props<ToggleDetailsGridPayload>()
);

export const reorderColumn = createAction(
  GridActionTypes.ReorderColumn,
  props<ReorderColumnPayload>()
);

export const resizeColumn = createAction(
  GridActionTypes.ResizeColumn,
  props<ResizeColumnPayload>()
);

export const deleteRow = createAction(
  GridActionTypes.DeleteRow,
  props<DeleteRowByIndexPayload | DeleteRowWherePayload<any>>()
);

export const addRow = createAction(
  GridActionTypes.AddRow,
  props<AddRowPayload<any>>()
);
