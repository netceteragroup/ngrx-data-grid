import { Action } from '@ngrx/store';
import { ColumnConfig, GridConfig } from '@grid/config/Config';


export enum GridActionTypes {
  UpdateGridData = '[Grid] Update Grid Data',
  UpdateColumnConfig= '[Grid] Update Cell Config',
  UpdateGridConfig= '[Grid] Update Grid Config'
}

export class UpdateGridData implements Action {
  readonly type = GridActionTypes.UpdateGridData;

  constructor(public gridData: Object[]) {}
}

export class UpdateColumnConfig implements Action {
  readonly type = GridActionTypes.UpdateColumnConfig;

  constructor(public columnConfig: ColumnConfig[]) {}
}

export class UpdateGridConfig implements Action {
  readonly type = GridActionTypes.UpdateGridConfig;

  constructor(public gridConfig: GridConfig) {}
}

export type ActionsUnion = UpdateGridData | UpdateColumnConfig | UpdateGridConfig;
