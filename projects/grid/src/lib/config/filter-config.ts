interface BaseColumnFilter {
  type: FilterType;
  isFiltered?: boolean;
}

interface TextColumnFilter extends BaseColumnFilter {
  condition?: {
    filterKey: FilteringOptions;
    filterValue: string;
  };
}

interface NumberColumnFilter extends BaseColumnFilter {
  condition?: {
    filterKey: FilteringOptions;
    filterValue: number;
  };
}

interface BooleanColumnFilter extends BaseColumnFilter {
  condition?: {
    filterKey: FilteringOptions;
    filterValue: boolean;
  };
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

export type GridColumnFilter = TextColumnFilter
  | NumberColumnFilter
  | BooleanColumnFilter;
