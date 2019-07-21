import * as R from 'ramda';
import {hasValue, isNotEqual, toBoolean, toNumber, toString} from '../util/type';
import {DataFilterWithValueResolver, FilteringOptions, FilterType} from '../models/grid-filter';

export const filterWithCondition = R.allPass([
  R.has('condition'),
  R.compose(hasValue, R.prop('condition'))
]);

const toType = R.cond([
  [R.equals(FilterType.Number), R.always(toNumber)],
  [R.equals(FilterType.Boolean), R.always(toBoolean)],
  [R.T, R.always(toString)]
]);

const applyOnValue = (fn, valueResolver) => R.always(R.compose(fn, valueResolver));

const applyFilterOption = ({filter: {filterType, condition: {option, value}}, valueResolver}): any => {
  const providedValue = toType(filterType)(value);
  return R.cond([
    [R.equals(FilteringOptions.None), R.always(R.identity)],
    [R.equals(FilteringOptions.Equals), applyOnValue(R.equals(providedValue), valueResolver)],
    [R.equals(FilteringOptions.NotEqual), applyOnValue(isNotEqual(providedValue), valueResolver)],
    [R.equals(FilteringOptions.Contains), applyOnValue(R.contains(providedValue), valueResolver)],
    [R.equals(FilteringOptions.NotContains), applyOnValue(R.complement(R.contains(providedValue)), valueResolver)],
    [R.equals(FilteringOptions.StartsWith), applyOnValue(R.startsWith(providedValue), valueResolver)],
    [R.equals(FilteringOptions.EndsWith), applyOnValue(R.endsWith(providedValue), valueResolver)],
    [R.equals(FilteringOptions.LessThan), applyOnValue(R.gt(providedValue), valueResolver)],
    [R.equals(FilteringOptions.LessThanOrEqual), applyOnValue(R.gte(providedValue), valueResolver)],
    [R.equals(FilteringOptions.GreaterThan), applyOnValue(R.lt(providedValue), valueResolver)],
    [R.equals(FilteringOptions.GreaterThanOrEquals), applyOnValue(R.lte(providedValue), valueResolver)],
    [R.equals(FilteringOptions.True), applyOnValue(R.equals(providedValue), valueResolver)],
    [R.equals(FilteringOptions.False), applyOnValue(R.equals(providedValue), valueResolver)]
  ])(option);
};

const filtersWithCondition = R.filter(R.compose(filterWithCondition, R.path(['filter'])));
export const applyFilters = (filters: DataFilterWithValueResolver[] = []) => {
  const filterFns = R.map(applyFilterOption, filtersWithCondition((filters)));
  return R.filter(R.allPass(filterFns));
};
