import { Action } from '@ngrx/store';
import { ColumnConfig, GridConfig } from '@grid/config/Config';


export enum GridActionTypes {
  InitGridData = '[Grid] Init Grid Data',
  InitColumnConfig= '[Grid] Init Cell Config',
  InitGridConfig= '[Grid] Init Grid Config'
}

export class InitGridData implements Action {
  readonly type = GridActionTypes.InitGridData;

  constructor(public gridData: Object[]) {}
}

export class InitColumnConfig implements Action {
  readonly type = GridActionTypes.InitColumnConfig;

  constructor(public columnConfig: ColumnConfig[]) {}
}

export class InitGridConfig implements Action {
  readonly type = GridActionTypes.InitGridConfig;

  constructor(public gridConfig: GridConfig) {}
}

export type ActionsUnion = InitGridData | InitColumnConfig | InitGridConfig;
