import { Action } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

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

export class InitGrid implements Action {
  readonly type = GridActionTypes.InitGrid;

  constructor(public payload: { initialData: Object[], columnConfig: ColumnConfig[], gridConfig: GridConfig }) {
  }
}

export class SortGrid implements Action {
  readonly type = GridActionTypes.SortGrid;

  constructor(public payload: ColumnConfig) {
  }
}

export class ChangePageSize implements Action {
  readonly type = GridActionTypes.ChangePageSize;

  constructor(public payload: number) {
  }
}

export class ChangePageNumber implements Action {
  readonly type = GridActionTypes.ChangePageNumber;

  constructor(public payload: number) {
  }
}

export class ToggleColumnVisibility implements Action {
  readonly type = GridActionTypes.ToggleColumnVisibility;

  constructor(public payload: number) {
  }
}

export class FilterGrid implements Action {
  readonly type = GridActionTypes.FilterGrid;

  constructor(public payload: ColumnConfig) {
  }
}

export class ToggleRowSelection implements Action {
  readonly type = GridActionTypes.ToggleRowSelection;

  constructor(public payload: number) {
  }
}

export class ToggleSelectAllRows implements Action {
  readonly type = GridActionTypes.ToggleSelectAllRows;
}

export type GridActions = InitGrid
  | ChangePageSize
  | ChangePageNumber
  | ToggleRowSelection
  | ToggleSelectAllRows
  | ToggleColumnVisibility
  | SortGrid
  | FilterGrid;