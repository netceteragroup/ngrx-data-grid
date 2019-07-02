import { ColumnConfig } from '@grid/config/column-config';
import * as R from 'ramda';
import { FilteringOptions, FilterType } from '@grid/config/filter-config';
import { applyValueGetterAndFormatter } from '@grid/util/grid';
import { GridState } from '@grid/store/grid-reducer';

const isEqual = (gridDataValue, inputValue): boolean => R.equals(gridDataValue, inputValue);
const doesContain = (gridDataValue, inputValue): boolean => <any>R.contains(inputValue, gridDataValue);
const lt = (gridDataValue, inputValue): boolean => R.lt(gridDataValue, inputValue);
const gt = (gridDataValue, inputValue): boolean => R.gt(gridDataValue, inputValue);
const calendarToDate = (calendar): string => `${calendar.year}-${('0' + calendar.month).slice(-2)}-${('0' + calendar.day).slice(-2)}`;

const notEqual = (config: ColumnConfig, gridData: any) => R.filter(data => !isEqual(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);
const equal = (config: ColumnConfig, gridData: any) => R.filter(data => isEqual(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);
const notContain = (config: ColumnConfig, gridData: any) => R.filter(data => !doesContain(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);
const contain = (config: ColumnConfig, gridData: any) => R.filter(data => doesContain(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);
const lessThan = (config: ColumnConfig, gridData: any) => R.filter(data => lt(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);
const greaterThan = (config: ColumnConfig, gridData: any) => R.filter(data => gt(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);
const lessThanOrEquals = (config: ColumnConfig, gridData: any) => R.filter(data => !gt(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);
const greaterThanOrEquals = (config: ColumnConfig, gridData: any) => R.filter(data => !lt(applyValueGetterAndFormatter(config)(data[config.field]), config.filter.condition.filterValue), gridData);

const textFilterOptions = (config: ColumnConfig, gridData: any) => R.cond([
  [R.equals(FilteringOptions.Equals), () => equal(config, gridData)],
  [R.equals(FilteringOptions.NotEqual), () => notEqual(config, gridData)],
  [R.equals(FilteringOptions.Contains), () => contain(config, gridData)],
  [R.equals(FilteringOptions.NotContains), () => notContain(config, gridData)],
  [R.equals(FilteringOptions.StartsWith), () => R.filter(data => R.startsWith(config.filter.condition.filterValue, applyValueGetterAndFormatter(config)(data[config.field])), gridData)],
  [R.equals(FilteringOptions.EndsWith), () => R.filter(data => R.endsWith(config.filter.condition.filterValue, applyValueGetterAndFormatter(config)(data[config.field])), gridData)]
])(config.filter.condition.filterKey);

const numberFilterOptions = (config: ColumnConfig, gridData: any) => {
  config.filter.condition.filterValue = +config.filter.condition.filterValue;
  return R.cond([
    [R.equals(FilteringOptions.Equals), () => equal(config, gridData)],
    [R.equals(FilteringOptions.NotEqual), () => notEqual(config, gridData)],
    [R.equals(FilteringOptions.LessThan), () => lessThan(config, gridData)],
    [R.equals(FilteringOptions.LessThanOrEqual), () => lessThanOrEquals(config, gridData)],
    [R.equals(FilteringOptions.GreaterThan), () => greaterThan(config, gridData)],
    [R.equals(FilteringOptions.GreaterThanOrEquals), () => greaterThanOrEquals(config, gridData)]
  ])(config.filter.condition.filterKey);
};

// FilterOptions for DateFilterType
const useDateValueGetterAndFormatter = (config: ColumnConfig, data) => new Date(applyValueGetterAndFormatter(config)(data));
const applyCalendarToDate = (date) => new Date(calendarToDate(date));

const dateEquality = (config: ColumnConfig, gridData: any) => R.filter(data => isEqual(useDateValueGetterAndFormatter(config, data[config.field]).getTime(),
  applyCalendarToDate(config.filter.condition.filterValue).getTime()), gridData);
const dateGreaterThan = (config: ColumnConfig, gridData: any) => R.filter(data => gt(useDateValueGetterAndFormatter(config, data[config.field]).getTime(),
  applyCalendarToDate(config.filter.condition.filterValue).getTime()), gridData);
const dateLessThan = (config: ColumnConfig, gridData: any) => R.filter(data => lt(useDateValueGetterAndFormatter(config, data[config.field]).getTime(),
  applyCalendarToDate(config.filter.condition.filterValue).getTime()), gridData);
const dateNotEqual = (config: ColumnConfig, gridData: any) => R.filter(data => !isEqual(useDateValueGetterAndFormatter(config, data[config.field]).getTime(),
  applyCalendarToDate(config.filter.condition.filterValue).getTime()), gridData);

const dateFilterOptions = (config: ColumnConfig, gridData: any) => R.cond([
  [R.equals(FilteringOptions.Equals), () => dateEquality(config, gridData)],
  [R.equals(FilteringOptions.NotEqual), () => dateNotEqual(config, gridData)],
  [R.equals(FilteringOptions.GreaterThan), () => dateGreaterThan(config, gridData)],
  [R.equals(FilteringOptions.LessThan), () => dateLessThan(config, gridData)]
])(config.filter.condition.filterKey);

// FilterOptions for BooleanFilterType
const booleanFilterOptions = (config: ColumnConfig, gridData: any) => equal(config, gridData);

const applyFilter = (config: ColumnConfig, gridData: any) => R.cond([
  [R.equals(FilterType.TextFilterType), () => textFilterOptions(config, gridData)],
  [R.equals(FilterType.NumberFilterType), () => numberFilterOptions(config, gridData)],
  [R.equals(FilterType.DateFilterType), () => dateFilterOptions(config, gridData)],
  [R.equals(FilterType.BooleanFilterType), () => booleanFilterOptions(config, gridData)]
])(config.filter.type);

export const getFilteredData = (state: GridState): Array<object> => {
  const activeFilters = R.filter((config: ColumnConfig) => config.filter.isFiltered === true, state.columnConfig);
  let newGridData = state.initialData;
  R.forEach((config: ColumnConfig) => {
    newGridData = applyFilter(config, newGridData);
  }, activeFilters);
  return newGridData;
};
