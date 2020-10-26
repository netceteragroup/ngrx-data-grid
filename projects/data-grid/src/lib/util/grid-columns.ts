import { columnHidden, columnVisible, DataGridColumnWithId } from '../models';
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

export const getHiddenColumnsCountBeforeIndex = (index, columns: DataGridColumnWithId[]) => {
  const columnsBeforeIndex: DataGridColumnWithId[] = R.slice(0, index, columns);
  return R.length(getHiddenColumns(columnsBeforeIndex));
};
