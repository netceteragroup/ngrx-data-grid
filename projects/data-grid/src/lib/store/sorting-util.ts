import * as R from 'ramda';
import {
  GridDataSortWithValueResolver,
  SortType
} from '../models';

const getSortFn = ({sortType, valueResolver}) => R.cond([
  [R.equals(SortType.Ascending), () => R.ascend(valueResolver)],
  [R.equals(SortType.Descending), () => R.descend(valueResolver)]
])(sortType);

export const applySorting = (sorting: GridDataSortWithValueResolver[] = []) => {
  const sortFns = R.map(getSortFn)(sorting);
  return R.sortWith(sortFns);
};
