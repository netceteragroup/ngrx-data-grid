import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  booleanFilterType,
  dateFilterType,
  FilterCondition,
  FilteringOptions,
  FilterType,
  getFilterOptions,
  textFilterType
} from '../../models';
import { LOCALE_TEXT_KEYS } from '../../constants';

@Component({
  selector: 'ngrx-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {

  @Input() type: FilterType;
  @Input() condition: FilterCondition = {option: FilteringOptions.None, value: null};

  @Output() applyFilter: EventEmitter<FilterCondition> = new EventEmitter<FilterCondition>();

  form: FormGroup;
  filterOptions: string[];
  readonly localeTexts = LOCALE_TEXT_KEYS.grid.filter;

  get inputType() {
    return textFilterType(this.type) ? 'text' : 'number';
  }

  get dateFilter() {
    return dateFilterType(this.type);
  }

  get booleanFilter() {
    return booleanFilterType(this.type);
  }

  ngOnInit(): void {
    this.filterOptions = getFilterOptions(this.type);
    this.createFormGroup();
  }

  private createFormGroup() {
    this.form = new FormGroup({
      option: new FormControl(this.condition.option),
      value: new FormControl(this.condition.value)
    });
  }

  get filterOption() {
    return this.form.get('option') as FormControl;
  }

  get filterValue() {
    return this.form.get('value') as FormControl;
  }

  onApplyFilter() {
    this.applyFilter.emit(this.form.value);
  }

  removeFilter() {
    this.filterOption.setValue(FilteringOptions.None);
    this.filterValue.setValue(null);
    this.onApplyFilter();
  }

}
