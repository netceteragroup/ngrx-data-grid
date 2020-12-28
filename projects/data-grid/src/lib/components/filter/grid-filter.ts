import { FilteringOptions } from '../../models/';
import { EventEmitter } from '@angular/core';

export interface FilterParams<T> {
  value: T;
  dataItemValue: T;
  rawValue: any;
  option: FilteringOptions;
}

export type FilterFn<T> = (params: FilterParams<T>) => boolean;

export interface GridFilter<T = any, P = any> {
  readonly options?: FilteringOptions[];
  props?: P;
  option?: FilteringOptions;
  value: T;
  valueChanged: EventEmitter<T>;

  filter: FilterFn<T>;
  clear(): void;
}
