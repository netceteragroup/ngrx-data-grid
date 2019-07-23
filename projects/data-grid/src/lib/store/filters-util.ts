import * as R from 'ramda';
import { isNotEqual, toBoolean, toNumber, toString } from '../util/type';
import { FilteringOptions, FilterType, filterWithCondition, GridDataFilterWithValueResolver } from '../models';

const toType = R.cond([
  [R.equals(FilterType.Number), R.always(toNumber)],
  [R.equals(FilterType.Boolean), R.always(toBoolean)],
  [R.T, R.always(toString)]
]);

const applyOnValue = (fn, valueResolver) => R.always(R.compose(fn, valueResolver));

const applyFilterOption = ({filterType, condition: {option, value}, valueResolver}): any => {
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
    [R.equals(FilteringOptions.True), applyOnValue(R.equals(true), valueResolver)],
    [R.equals(FilteringOptions.False), applyOnValue(R.equals(false), valueResolver)]
  ])(option);
};

const filtersWithCondition: any = R.filter(filterWithCondition);
export const applyFilters = (filters: GridDataFilterWithValueResolver[] = []) => {
  const filterFns = R.map(applyFilterOption, filtersWithCondition(filters));
  return R.filter(R.allPass(filterFns));
};
