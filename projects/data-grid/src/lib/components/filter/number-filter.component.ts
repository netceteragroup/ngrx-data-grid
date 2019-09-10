import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { GridFilter } from './grid-filter';
import { FilteringOptions } from '../../models';
import { always, cond, equals, gt, gte, identity, lt, lte } from 'ramda';
import { isNotEqual } from '../../util/type';

const filterByOption = (option: FilteringOptions, value: number) => cond([
  [equals(FilteringOptions.None), always(identity)],
  [equals(FilteringOptions.Equals), always(equals(value))],
  [equals(FilteringOptions.NotEqual), always(isNotEqual(value))],
  [equals(FilteringOptions.LessThan), always(gt(value))],
  [equals(FilteringOptions.LessThanOrEqual), always(gte(value))],
  [equals(FilteringOptions.GreaterThan), always(lt(value))],
  [equals(FilteringOptions.GreaterThanOrEquals), always(lte(value))]
])(option);

@Component({
  templateUrl: './number-filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberFilterComponent implements GridFilter<number> {
  @Input() value: number = null;

  @Output() valueChanged = new EventEmitter<number>();

  readonly options = [
    FilteringOptions.None,
    FilteringOptions.Equals,
    FilteringOptions.NotEqual,
    FilteringOptions.LessThan,
    FilteringOptions.LessThanOrEqual,
    FilteringOptions.GreaterThan,
    FilteringOptions.GreaterThanOrEquals
  ];

  filter({option, value, dataItemValue}) {
    return filterByOption(option, value)(dataItemValue);
  }

  updateValue(event) {
    this.value = Number(event.target.value);
    this.valueChanged.emit(this.value);
  }

  clear() {
    this.value = null;
  }

}
