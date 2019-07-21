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

interface FilterCondition {
  option: FilteringOptions;
  value: any;
}

export interface DataFilter {
  filterType: FilterType;
  field: string;
  condition?: FilterCondition;
}

export interface DataFilterWithValueResolver {
  filter: DataFilter;
  valueResolver: any;
}

