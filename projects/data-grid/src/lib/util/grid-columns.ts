import { COLUMN_ID, columnHidden, columnVisible, DataGridColumnWithId } from '../models';
import * as R from 'ramda';
import { hasValue } from './type';

type GetNumberOfActiveColumns = (c: DataGridColumnWithId[]) => number;
const getNumberOfColumns = R.compose(
  R.length,
  R.filter(columnVisible)
);
export const getNumberOfVisibleColumns: GetNumberOfActiveColumns = R.ifElse(hasValue, getNumberOfColumns, R.always(0));

type GetVisibleColumns = (c: DataGridColumnWithId[]) => DataGridColumnWithId[];
export const getVisibleColumns: GetVisibleColumns = R.filter(columnVisible);

type GetHiddenColumns = (c: DataGridColumnWithId[]) => DataGridColumnWithId[];
export const getHiddenColumns: GetHiddenColumns = R.filter(columnHidden);

export const getNumberOfHiddenColumnsBeforeIndex = (index, columns: DataGridColumnWithId[]) => {
  const columnsBeforeIndex: DataGridColumnWithId[] = R.slice(0, index, columns);
  return R.length(getHiddenColumns(columnsBeforeIndex));
};

export const updateColumnWidth = (columnId: string, width: number, columns: DataGridColumnWithId[]): DataGridColumnWithId[] =>
  R.map(R.ifElse(R.propEq(columnId, COLUMN_ID), R.assoc('width', width), R.identity()), columns);

type GetColumnsForSelection = (c: DataGridColumnWithId[]) => DataGridColumnWithId[];
export const getColumnsForSelection: GetColumnsForSelection =
  R.filter(column => column.headerName && !column.hideInSelection);
