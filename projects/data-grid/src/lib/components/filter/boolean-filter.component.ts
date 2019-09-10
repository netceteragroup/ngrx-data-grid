import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { GridFilter } from './grid-filter';
import { FilteringOptions } from '../../models';
import { always, cond, equals, identity, T } from 'ramda';

const filterByOption = (option: FilteringOptions) => cond([
  [equals(FilteringOptions.None), always(identity)],
  [equals(FilteringOptions.True), always(equals(true))],
  [equals(FilteringOptions.False), always(equals(false))]
])(option);

const getValue = cond([
  [equals(FilteringOptions.True), always(true)],
  [equals(FilteringOptions.False), always(false)],
  [T, always(null)]
]);

@Component({
  template: '',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooleanFilterComponent implements OnChanges, GridFilter<boolean> {
  @Input() value: boolean = null;
  @Input() option: FilteringOptions;

  @Output() valueChanged = new EventEmitter<boolean>();

  readonly options = [
    FilteringOptions.None,
    FilteringOptions.True,
    FilteringOptions.False
  ];

  ngOnChanges({option: optionChange}: SimpleChanges): void {
    if (optionChange) {
      this.value = getValue(this.option);
      this.valueChanged.emit(this.value);
    }
  }

  filter({option, dataItemValue}) {
    return filterByOption(option)(dataItemValue);
  }

  clear() {
    this.value = null;
  }

}
