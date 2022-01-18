import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { GridFilter } from './grid-filter';
import { FilteringOptions } from '../../models';
import { always, cond, equals, startsWith, endsWith, identity, includes, complement, toLower } from 'ramda';
import { isNotEqual } from '../../util/type';

const notContains = complement(includes);

const filterByOption = (option: FilteringOptions, value: string) => cond([
  [equals(FilteringOptions.None), always(identity)],
  [equals(FilteringOptions.Equals), always(equals(value))],
  [equals(FilteringOptions.NotEqual), always(isNotEqual(value))],
  [equals(FilteringOptions.Contains), always(includes(value))],
  [equals(FilteringOptions.NotContains), always(notContains(value))],
  [equals(FilteringOptions.StartsWith), always(startsWith(value))],
  [equals(FilteringOptions.EndsWith), always(endsWith(value))]
])(option);

const toComparableValue = (value: string | null): string => toLower(value || '');

@Component({
  templateUrl: './text-filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextFilterComponent implements GridFilter<string> {
  @Input() value = '';

  @Output() valueChanged = new EventEmitter<string>();

  readonly options = [
    FilteringOptions.None,
    FilteringOptions.Contains,
    FilteringOptions.NotContains,
    FilteringOptions.NotEqual,
    FilteringOptions.StartsWith,
    FilteringOptions.EndsWith
  ];

  filter({option, value, dataItemValue}) {
    return filterByOption(option, toComparableValue(value))(toComparableValue(dataItemValue));
  }

  updateValue(event) {
    this.value = event.target.value;
    this.valueChanged.emit(event.target.value);
  }

  clear() {
    this.value = '';
  }

}
