export interface BaseColumnFilter {
  type: FilterType;
  isFiltered?: boolean;
  condition?: GridColumnFilter;
}

interface TextColumnFilter {
  filterKey: FilteringOptions;
  filterValue: string;
}

interface NumberColumnFilter {
  filterKey: FilteringOptions;
  filterValue: number;
}

interface BooleanColumnFilter {
  filterKey: FilteringOptions;
  filterValue: boolean;
}

export enum FilterType {
  TextFilterType = 'TextFilter',
  NumberFilterType = 'NumberFilter',
  DateFilterType = 'DateFilter',
  BooleanFilterType = 'BooleanFilter'
}

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

type GridColumnFilter = TextColumnFilter
  | NumberColumnFilter
  | BooleanColumnFilter;
