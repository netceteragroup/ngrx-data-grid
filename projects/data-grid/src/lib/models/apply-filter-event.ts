import { FilteringOptions } from './data-grid-filter';

export interface ApplyFilterEvent {
  columnId: string;
  option: FilteringOptions;
  value: any;
}
