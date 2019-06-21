import { Action } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

export enum GridActionTypes {
  InitGrid = '[Grid] Init Grid',
  SortGrid = '[Grid] Sort Grid',
  ChangePageSize = '[Grid] Change Page Size',
  ChangePageNumber = '[Grid] Change Page Number',
  ToggleColumnVisibility = '[Grid] Toggle Column Visibility'
}

export class InitGrid implements Action {
  readonly type = GridActionTypes.InitGrid;

  constructor(public payload: { initialData: Object[], columnConfig: ColumnConfig[], gridConfig: GridConfig }) {
  }
}

export class SortGrid implements Action {
  readonly type = GridActionTypes.SortGrid;

  constructor(public payload: ColumnConfig) {}
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

export type GridActions = InitGrid
  | ChangePageSize
  | ChangePageNumber
  | SortGrid
  | ToggleColumnVisibility;
