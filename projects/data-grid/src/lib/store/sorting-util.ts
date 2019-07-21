import * as R from 'ramda';
import {DataItemSortWithValueResolver, SortType} from '../models';

const getSortFn = ({sorting: {sortType}, valueResolver}) => R.cond([
  [R.equals(SortType.Ascending), () => R.ascend(valueResolver)],
  [R.equals(SortType.Descending), () => R.descend(valueResolver)]
])(sortType);

export const applySorting = (sortings: DataItemSortWithValueResolver[] = []) => {
  const sortFns = R.map(getSortFn)(sortings);
  return R.sortWith(sortFns);
};
