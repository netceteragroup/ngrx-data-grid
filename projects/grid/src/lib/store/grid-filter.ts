import { ColumnConfig } from '@grid/config/column-config';
import * as R from 'ramda';
import { filteringOptions, FilterType } from '@grid/config/filter-config';
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

const dateEquality = (config: ColumnConfig, gridData: any) => R.filter(data => isEqual(new Date(applyValueGetterAndFormatter(config)(data[config.field])).getTime(),
  new Date(calendarToDate(config.filter.condition.filterValue)).getTime()), gridData);
const dateGreaterThan = (config: ColumnConfig, gridData: any) => R.filter(data => gt(new Date(applyValueGetterAndFormatter(config)(data[config.field])).getTime(),
  new Date(calendarToDate(config.filter.condition.filterValue)).getTime()), gridData);
const dateLessThan = (config: ColumnConfig, gridData: any) => R.filter(data => lt(new Date(applyValueGetterAndFormatter(config)(data[config.field])).getTime(),
  new Date(calendarToDate(config.filter.condition.filterValue)).getTime()), gridData);
const dateNotEqual = (config: ColumnConfig, gridData: any) => R.filter(data => !isEqual(new Date(applyValueGetterAndFormatter(config)(data[config.field])).getTime(),
  new Date(calendarToDate(config.filter.condition.filterValue)).getTime()), gridData);


const textFilterOptions = (config: ColumnConfig, gridData: any) => R.cond([
  [R.equals(filteringOptions.Equals), () => equal(config, gridData)],
  [R.equals(filteringOptions.NotEqual), () => notEqual(config, gridData)],
  [R.equals(filteringOptions.Contains), () => contain(config, gridData)],
  [R.equals(filteringOptions.NotContains), () => notContain(config, gridData)],
  [R.equals(filteringOptions.StartsWith), () => R.filter(data => R.startsWith(config.filter.condition.filterValue, applyValueGetterAndFormatter(config)(data[config.field])), gridData)],
  [R.equals(filteringOptions.EndsWith), () => R.filter(data => R.endsWith(config.filter.condition.filterValue, applyValueGetterAndFormatter(config)(data[config.field])), gridData)]
])(config.filter.condition.filterKey);

const numberFilterOptions = (config: ColumnConfig, gridData: any) => {
  config.filter.condition.filterValue = +config.filter.condition.filterValue;
  return R.cond([
    [R.equals(filteringOptions.Equals), () => equal(config, gridData)],
    [R.equals(filteringOptions.NotEqual), () => notEqual(config, gridData)],
    [R.equals(filteringOptions.LessThan), () => lessThan(config, gridData)],
    [R.equals(filteringOptions.LessThanOrEqual), () => lessThanOrEquals(config, gridData)],
    [R.equals(filteringOptions.GreaterThan), () => greaterThan(config, gridData)],
    [R.equals(filteringOptions.GreaterThanOrEquals), () => greaterThanOrEquals(config, gridData)]
  ])(config.filter.condition.filterKey);
};

const dateFilterOptions = (config: ColumnConfig, gridData: any) => R.cond([
  [R.equals(filteringOptions.Equals), () => dateEquality(config, gridData)],
  [R.equals(filteringOptions.NotEqual), () => dateNotEqual(config, gridData)],
  [R.equals(filteringOptions.GreaterThan), () => dateGreaterThan(config, gridData)],
  [R.equals(filteringOptions.LessThan), () => dateLessThan(config, gridData)]
])(config.filter.condition.filterKey);

const filterType = (config: ColumnConfig, gridData: any) => R.cond([
  [R.equals(FilterType.textFilterType), () => textFilterOptions(config, gridData)],
  [R.equals(FilterType.numberFilterType), () => numberFilterOptions(config, gridData)],
  [R.equals(FilterType.DateFilterType), () => dateFilterOptions(config, gridData)]
])(config.filter.type);


export const getFilteredData = (state: GridState): Array<object> => {
  const activeFilters = R.filter((config: ColumnConfig) => config.filter.isFiltered === true, state.columnConfig);
  let newGridData = state.initialData;
  R.forEach((config: ColumnConfig) => {
    newGridData = filterType(config, newGridData);
  }, activeFilters);
  return newGridData;
};

