export class FilterOptionsService {
  numberFilters: string[];
  textFilters: string[];
  dateFilters: string[];

  constructor() {
    this.numberFilters = [
      'None',
      'Equals',
      'Not equal',
      'Less than',
      'Less than or equals',
      'Greater than',
      'Greater than or equals'
    ];

    this.textFilters = [
      'None',
      'Contains',
      'Not contains',
      'Equals',
      'Not equal',
      'Starts with',
      'Ends with'
    ];

    this.dateFilters = [
      'None',
      'Equals',
      'Greater than',
      'Less than',
      'Not equal'
    ];
  }

  get textFilterOptions(): string[] {
    return this.textFilters;
  }

  get numberFilterOptions(): string[] {
    return this.numberFilters;
  }

  get dateFilterOptions(): string[] {
    return this.dateFilters;
  }


}
