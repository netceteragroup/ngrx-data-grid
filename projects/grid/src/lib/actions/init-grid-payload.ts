import { ColumnConfig, GridConfig } from '../config';

export interface InitGridPayload {
  initialData: Object[];
  columnConfig: ColumnConfig[];
  gridConfig: GridConfig;
}
