import {hasValue} from '../util/type';
import * as R from 'ramda';

export type ColumnValueGetterType = <T extends object = object>(dataItem: T) => string;

export interface DataGridColumn {
  columnId: string;
  headerName: string;
  field: string;
  visible: boolean;
  sortAvailable: boolean;
  filterAvailable: boolean;
  valueGetter?: ColumnValueGetterType;
}

export const findDataGridColumn = (field: string, dataGridColumns: DataGridColumn[]) => R.find(R.propEq('field', field))(dataGridColumns);
export const columnValueResolver = ({valueGetter, field}: DataGridColumn) => hasValue(valueGetter) ? valueGetter : R.prop(field);
