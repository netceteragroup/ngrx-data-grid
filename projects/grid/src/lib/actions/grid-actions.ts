import { Action } from '@ngrx/store';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

export enum GridActionTypes {
  InitGrid = '[Grid] Init Grid',
  InitColumnConfig= '[Grid] Init Cell Config',
  InitGridConfig= '[Grid] Init Grid Config'
}

export class InitGrid implements Action {
  readonly type = GridActionTypes.InitGrid;

  constructor(public gridData: Object[], public columnConfig: ColumnConfig[], public gridConfig: GridConfig) {}
}

export type GridActions = InitGrid;
