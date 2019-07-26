import { columnVisible, DataGridColumn } from '../models';
import * as R from 'ramda';

type GetNumberOfActiveColumns = (c: DataGridColumn[]) => number;
export const getNumberOfVisibleColumns: GetNumberOfActiveColumns = R.compose(
  R.length,
  R.filter(columnVisible)
);
