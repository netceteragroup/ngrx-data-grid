import { FilterOptionsService } from './filter-options.service';

describe('FilterOptionsSerice', () => {
  let service: FilterOptionsService;

  const mockTextFilterOptions = [
    'None',
    'Contains',
    'Not contains',
    'Equals',
    'Not equal',
    'Starts with',
    'Ends with'
  ];

  const mockNumberFilterOptions = [
    'None',
    'Equals',
    'Not equal',
    'Less than',
    'Less than or equals',
    'Greater than',
    'Greater than or equals'
  ];

  const mockDateFilterOptions = [
    'None',
    'Equals',
    'Greater than',
    'Less than',
    'Not equal'
  ];

  beforeEach(() => {
    service = new FilterOptionsService();
  });

  it('should return array of textModel filtering options', () => {
    expect(service.textFilterOptions).toEqual(mockTextFilterOptions);
  });

  it('should return array of numberModel filtering options', () => {
    expect(service.numberFilterOptions).toEqual(mockNumberFilterOptions);
  });

  it('should return array of dateModel filtering options', () => {
    expect(service.dateFilterOptions).toEqual(mockDateFilterOptions);
  });
});
