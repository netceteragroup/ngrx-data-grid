import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GridFilter } from 'ngrx-data-grid';
import { any, propEq } from 'ramda';

const titleEquals = propEq('title');

@Component({
  templateUrl: 'experience-filter.component.html'
})
export class ExperienceFilterComponent implements GridFilter<string> {
  @Input() value = 'Librarian';
  @Input() props: any;

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

  onExperienceSelected(event) {
    this.value = event.target.value;
    this.valueChanged.emit(this.value);
  }

  filter({value, rawValue: experiences}) {
    return any(titleEquals(value), experiences);
  }

  clear(): void {
    this.value = null;
  }

}
