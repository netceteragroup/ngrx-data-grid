import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilteringOptions, GridFilter } from 'ngrx-data-grid';
import { always, complement, cond, equals, identity, any, none, propEq } from 'ramda';

const isNotEqual = complement(equals);
const titleEquals = propEq('title');

const filterByOption = (option: FilteringOptions, value: Date) => cond([
  [equals(FilteringOptions.None), always(identity)],
  [equals(FilteringOptions.Equals), always(any(titleEquals(value)))],
  [equals(FilteringOptions.NotEqual), always(none(titleEquals(value)))]
])(option);

@Component({
  templateUrl: 'experience-filter.component.html'
})
export class ExperienceFilterComponent implements GridFilter<string> {
  @Input() value = 'Librarian';

  @Output() valueChanged = new EventEmitter<string>();

  readonly experienceOptions = [
    'Librarian',
    'Geological Engineer',
    'Occupational Therapist',
    'Account Coordinator',
    'Operator',
    'VP Marketing',
    'Food Chemist'
  ];

  readonly options = [
    FilteringOptions.Equals,
    FilteringOptions.NotEqual
  ];

  onExperienceSelected(event) {
    this.value = event.target.value;
    this.valueChanged.emit(this.value);
  }

  filter({option, value, rawValue: experiences}) {
    return filterByOption(option, value)(experiences);
  }

  clear(): void {
    this.value = null;
  }

}
