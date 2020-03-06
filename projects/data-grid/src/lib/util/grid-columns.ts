import { columnVisible, DataGridColumnWithId } from '../models';
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
