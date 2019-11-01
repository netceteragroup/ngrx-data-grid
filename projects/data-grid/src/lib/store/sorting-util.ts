import * as R from 'ramda';
import {
  Comparator,
  GridDataSortWithValueResolver,
  SortType
} from '../models';

const descendingComparator = (comparator: Comparator): Comparator =>
  (x, y) => R.negate(comparator(x, y));

const getSortFn = ({sortType, valueResolver, comparator}: GridDataSortWithValueResolver) => R.cond([
  [R.equals(SortType.Ascending), () => comparator || R.ascend(valueResolver)],
  [R.equals(SortType.Descending), () => comparator ? descendingComparator(comparator) : R.descend(valueResolver)]
])(sortType);

export const applySorting = (sorting: GridDataSortWithValueResolver[] = []) => {
  const sortFns = R.map(getSortFn)(sorting);
  return R.sortWith(sortFns);
};
