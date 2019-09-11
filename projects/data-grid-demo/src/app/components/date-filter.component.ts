import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilteringOptions, GridFilter } from 'ngrx-data-grid';
import { always, complement, cond, equals, gt, identity, lt } from 'ramda';
import { NgbDate, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

const isNotEqual = complement(equals);

const filterByOption = (option: FilteringOptions, value: Date) => cond([
  [equals(FilteringOptions.None), always(identity)],
  [equals(FilteringOptions.Equals), always(equals(value))],
  [equals(FilteringOptions.NotEqual), always(isNotEqual(value))],
  [equals(FilteringOptions.LessThan), always(gt(value))],
  [equals(FilteringOptions.GreaterThan), always(lt(value))]
])(option);

@Component({
  templateUrl: 'date-filter.component.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class DateFilterComponent implements GridFilter<NgbDate> {
  @Input() value: NgbDate;

  @Output() valueChanged = new EventEmitter<NgbDate>();

  readonly options = [
    FilteringOptions.None,
    FilteringOptions.Equals,
    FilteringOptions.NotEqual,
    FilteringOptions.LessThan,
    FilteringOptions.GreaterThan
  ];

  onDateSelect() {
    this.valueChanged.emit(this.value);
  }

  filter({option, value, rawValue}) {
    return filterByOption(option, value)(rawValue);
  }

  clear(): void {
    this.value = null;
  }

}
