import * as R from 'ramda';
import {hasValue, toNumber, toString} from '../util/type';
import {DataFilter, FilteringOptions} from '../models/grid-filter';

export const filterWithCondition = R.compose(hasValue, R.prop('condition'));
export const filtersWithCondition = R.filter(filterWithCondition);

const applyOnProp = (prop, fn) => R.compose(fn, R.prop(prop));

const applyFilterOption = ({field, condition: {option, value}}): any => R.cond([
  [R.equals(FilteringOptions.None), R.always(R.identity)],
  [R.equals(FilteringOptions.Equals), R.always(applyOnProp(field, R.equals(value)))],
  [R.equals(FilteringOptions.NotEqual), R.always(applyOnProp(field, R.complement(R.equals(value))))],
  [R.equals(FilteringOptions.Contains), R.always(applyOnProp(field, R.contains(value)))],
  [R.equals(FilteringOptions.NotContains), R.always(applyOnProp(field, R.complement(R.contains(value))))],
  [R.equals(FilteringOptions.StartsWith), R.always(applyOnProp(field, R.startsWith(toString(value))))],
  [R.equals(FilteringOptions.EndsWith), R.always(applyOnProp(field, R.endsWith(toString(value))))],
  [R.equals(FilteringOptions.LessThan), R.always(applyOnProp(field, R.gt(toNumber(value))))],
  [R.equals(FilteringOptions.LessThanOrEqual), R.always(applyOnProp(field, R.gte(toNumber(value))))],
  [R.equals(FilteringOptions.GreaterThan), R.always(applyOnProp(field, R.lt(toNumber(value))))],
  [R.equals(FilteringOptions.GreaterThanOrEquals), R.always(applyOnProp(field, R.lte(toNumber(value))))],
  [R.equals(FilteringOptions.True), R.always(applyOnProp(field, R.equals(value)))],
  [R.equals(FilteringOptions.False), R.always(applyOnProp(field, R.equals(value)))]
])(option);

export const applyFilters = (filters: DataFilter[] = []) => {
  const filterFns = R.map(applyFilterOption, filtersWithCondition((filters)));
  return R.filter(R.allPass(filterFns));
};
