import * as R from 'ramda';
import {DataItemSort, SortType} from '../models/grid-sort';

const getSortFn = ({field, sortType}) => R.cond([
  [R.equals(SortType.Ascending), () => R.ascend(R.prop(field))],
  [R.equals(SortType.Descending), () => R.descend(R.prop(field))]
])(sortType);

export const applySorting = (sortings: DataItemSort[] = []) => {
  const sortFns = R.map(getSortFn)(sortings);
  return R.sortWith(sortFns);
};
