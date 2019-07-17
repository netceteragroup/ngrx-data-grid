import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

export interface InitGridPayload {
  initialData: Object[];
  columnConfig: ColumnConfig[];
  gridConfig: GridConfig;
}
