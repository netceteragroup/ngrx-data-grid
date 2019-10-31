import { columnVisible, DataGridColumnWithId } from '../models';
import * as R from 'ramda';

type GetNumberOfActiveColumns = (c: DataGridColumnWithId[]) => number;
export const getNumberOfVisibleColumns: GetNumberOfActiveColumns = R.compose(
  R.length,
  R.filter(columnVisible)
);

type GetVisibleColumns = (c: DataGridColumnWithId[]) => DataGridColumnWithId[];
export const getVisibleColumns: GetVisibleColumns = R.filter(columnVisible);
