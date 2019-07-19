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

interface FilterCondition {
  option: FilteringOptions;
  value: string | number | boolean;
}

export interface DataFilter {
  field: string;
  condition?: FilterCondition;
}
