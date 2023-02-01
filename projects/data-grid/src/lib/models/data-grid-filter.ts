import * as R from 'ramda';
import { hasValue, isNotEqual } from '../util/type';
import { GridFilter } from '../components/filter/grid-filter';
import { Type } from '@angular/core';

export enum FilteringOptions {
  None = 'grid.filter.none',
  Equals = 'grid.filter.equals',
  Contains = 'grid.filter.contains',
  NotContains = 'grid.filter.notContains',
  NotEqual = 'grid.filter.notEqual',
  StartsWith = 'grid.filter.startsWith',
  EndsWith = 'grid.filter.endsWith',
  LessThan = 'grid.filter.lessThan',
  LessThanOrEqual = 'grid.filter.lessThanOrEquals',
  GreaterThan = 'grid.filter.greaterThan',
  GreaterThanOrEquals = 'grid.filter.greaterThanOrEquals',
  False = 'grid.filter.false',
  True = 'grid.filter.true'
}

export enum FilterType {
  Text = 'Text',
  Number = 'Number',
  Boolean = 'Boolean'
}

export type FilterByValueResolver = <T extends object = object>(item: T) => any;

export interface GridDataFilter<T = any, P = any> {
  filterType?: FilterType;
  option?: FilteringOptions;
  value?: T;
  component?: Type<GridFilter>;
  props?: P;
}

export interface GridDataFilterWithColumnId extends GridDataFilter {
  columnId: string;
}

export interface GridDataFilterWithValueResolver extends GridDataFilter {
  valueResolver: FilterByValueResolver;
}

type GridDataFilterCheck = (f: GridDataFilterWithColumnId | GridDataFilterWithValueResolver) => boolean;

const hasFilterValue: GridDataFilterCheck = R.compose(hasValue, R.prop('value'));
const notNoneFilterOption: GridDataFilterCheck = R.compose(isNotEqual(FilteringOptions.None), R.prop('option'));

type FilterApplied = (c: GridDataFilter) => boolean;
export const filterApplied: FilterApplied = R.allPass([hasFilterValue, notNoneFilterOption]);
