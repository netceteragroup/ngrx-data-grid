import { Action } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

export enum GridActionTypes {
  InitGrid = '[Grid] Init Grid',
  ChangePageSize = '[Grid] Change Page Size',
  ChangePageNumber = '[Grid] Change Page Number'
}

export class InitGrid implements Action {
  readonly type = GridActionTypes.InitGrid;

  constructor(public payload: { initialData: Object[], columnConfig: ColumnConfig[], gridConfig: GridConfig }) {
  }
}

export class ChangePageSize implements Action {
  readonly type = GridActionTypes.ChangePageSize;

  constructor(public paginationPageSize: number) {
  }
}

export class ChangePageNumber implements Action {
  readonly type = GridActionTypes.ChangePageNumber;

  constructor(public currentPage: number) {
  }
}

export type GridActions = InitGrid;
