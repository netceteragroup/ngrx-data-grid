import * as R from 'ramda';
import { hasValue, isNotEqual } from '../util/type';

export enum FilteringOptions {
  None = 'None',
  Equals = 'Equals',
  Contains = 'Contains',
  NotContains = 'Not contains',
  NotEqual = 'Not equal',
  StartsWith = 'Starts with',
  EndsWith = 'Ends with',
  LessThan = 'Less than',
  LessThanOrEqual = 'Less than or equals',
  GreaterThan = 'Greater than',
  GreaterThanOrEquals = 'Greater than or equals',
  False = 'False',
  True = 'True'
}

export enum FilterType {
  Text = 'Text',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
  Custom = 'Custom'
}

export interface FilterCondition {
  option: FilteringOptions;
  value: any;
}

export interface GridDataFilter {
  filterType: FilterType;
  condition?: FilterCondition;
}

export interface GridDataFilterWithColumnId extends GridDataFilter {
  columnId: string;
}

export interface GridDataFilterWithValueResolver extends GridDataFilter {
  valueResolver: any;
}

export const textFilterType = R.equals(FilterType.Text);
export const numberFilterType = R.equals(FilterType.Number);
export const booleanFilterType = R.equals(FilterType.Boolean);
export const dateFilterType = R.equals(FilterType.Date);

type GridDataFilterCheck = (f: GridDataFilterWithColumnId | GridDataFilterWithValueResolver) => boolean;

export const filterWithCondition: GridDataFilterCheck = R.allPass([
  R.has('condition'),
  R.compose(hasValue, R.prop('condition'))
]);

const hasFilterValue: GridDataFilterCheck = R.compose(hasValue, R.path(['condition', 'value']));
const notNoneFilterOption: GridDataFilterCheck = R.compose(isNotEqual(FilteringOptions.None), R.path(['condition', 'option']));

export const filterApplied: GridDataFilterCheck = R.allPass([filterWithCondition, R.anyPass([hasFilterValue, notNoneFilterOption])]);

export const getFilterOptions = R.cond([
  [R.equals(FilterType.Number), R.always([
    FilteringOptions.None,
    FilteringOptions.Equals,
    FilteringOptions.NotEqual,
    FilteringOptions.LessThan,
    FilteringOptions.LessThanOrEqual,
    FilteringOptions.GreaterThan,
    FilteringOptions.GreaterThanOrEquals
  ])],
  [R.equals(FilterType.Date), R.always([FilteringOptions.None, FilteringOptions.Equals, FilteringOptions.NotEqual, FilteringOptions.LessThan, FilteringOptions.GreaterThan])],
  [R.equals(FilterType.Boolean), R.always([FilteringOptions.None, FilteringOptions.True, FilteringOptions.False])],
  [R.T, R.always([FilteringOptions.None, FilteringOptions.Contains, FilteringOptions.NotContains, FilteringOptions.NotEqual, FilteringOptions.StartsWith, FilteringOptions.EndsWith])]
]);
