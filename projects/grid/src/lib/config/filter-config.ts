interface TextColumnFilterModel {
  type: FilterType;
  isFiltered?: boolean;
  condition?: {
    filterKey: filteringOptions,
    filterValue: string
  };
}

interface NumberColumnFilterModel {
  type: FilterType;
  isFiltered: boolean;
  condition?: {
    filterKey: filteringOptions,
    filterValue: number
  };
}

interface BooleanColumnFilterModel {
  type: FilterType;
  isFiltered: boolean;
  condition?: {
    filterKey: filteringOptions,
    filterValue: boolean
  };
}

export enum FilterType {
  textFilterType = 'TextFilter',
  numberFilterType = 'NumberFilter',
  DateFilterType = 'DateFilter'
}

export const enum filteringOptions {
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
  GreaterThanOrEquals = 'Greater than or equals'
}


export type GridColumnFilter = TextColumnFilterModel
  | NumberColumnFilterModel
  | BooleanColumnFilterModel;
