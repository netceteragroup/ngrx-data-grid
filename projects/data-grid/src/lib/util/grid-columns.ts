import { columnVisible, DataGridColumnWithId } from '../models';
import * as R from 'ramda';

type GetNumberOfActiveColumns = (c: DataGridColumnWithId[]) => number;
export const getNumberOfVisibleColumns: GetNumberOfActiveColumns = R.compose(
  R.length,
  R.filter(columnVisible)
);
