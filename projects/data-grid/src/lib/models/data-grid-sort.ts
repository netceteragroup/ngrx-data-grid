import * as R from 'ramda';
import { hasValue } from '../util/type';

export enum SortType {
  Ascending = 'ASC',
  Descending = 'DESC'
}

export interface GridDataSort {
  sortType: SortType;
}

export interface GridDataSortWithColumnId extends GridDataSort {
  columnId: string;
}

export interface GridDataSortWithValueResolver extends GridDataSort {
  valueResolver: any;
}

export const sortAscending = R.allPass([hasValue, R.equals(SortType.Ascending)]);
export const sortDescending = R.allPass([hasValue, R.equals(SortType.Descending)]);
