import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ColumnConfig } from '@grid/config/column-config';
import * as R from 'ramda';
import { FilterOptionsService } from '@grid/services/filter-options/filter-options.service';
import { filteringOptions, FilterType, GridColumnFilter } from '@grid/config/filter-config';

@Component({
  selector: 'pcs-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
  @Input() config: ColumnConfig;
  @Output() changeFilterInConfig: EventEmitter<ColumnConfig> = new EventEmitter<ColumnConfig>();

  filterOptions: string[];
  form: FormGroup;
  firstFilterProperty: FormControl;
  firstFilterValue: FormControl;

  constructor(private filter: FilterOptionsService) {
  }

  get inputType() {
    if (this.config.filter) {
      return this.config.filter.type === FilterType.textFilterType ? 'text' : 'number';
    }
  }

  get isDateField() {
    return this.config.filter.type === FilterType.DateFilterType;
  }

  ngOnInit(): void {
    R.cond([
      [R.equals(FilterType.numberFilterType), () => this.filterOptions = this.filter.numberFilterOptions],
      [R.equals(FilterType.DateFilterType), () => this.filterOptions = this.filter.dateFilterOptions],
      [R.T, () => this.filterOptions = this.filter.textFilterOptions]
    ])(this.config.filter.type);
    this.createFormControls();
    this.createFormGroup();
  }

  onSubmitFilterForm() {
    R.cond([
      [R.has('condition'), () => this.emitChangeInFilterConfig()],
      [R.T, () => this.createFilterFieldInConfigForHeader()]
    ])(this.config.filter);
  }

  removeFilter() {
    this.firstFilterProperty.setValue(filteringOptions.None);
    this.firstFilterValue.setValue(null);
    this.emitChangeInFilterConfig();
  }

  private createFormControls() {
    this.firstFilterProperty = new FormControl(this.config.filter.condition ? this.config.filter.condition.filterKey : filteringOptions.None);
    this.firstFilterValue = new FormControl(this.config.filter.condition ? this.config.filter.condition.filterValue : '');
  }

  private createFormGroup() {
    this.form = new FormGroup({
      firstFilterProperty: this.firstFilterProperty,
      firstFilterValue: this.firstFilterValue
    });
  }

  private emitChangeInFilterConfig() {
    if (this.firstFilterProperty.value === filteringOptions.None) {
      this.firstFilterValue.setValue(null);
    }
    this.config.filter.isFiltered = this.firstFilterProperty.value !== filteringOptions.None;
    this.config.filter.condition = {
      filterKey: this.firstFilterProperty.value,
      filterValue: this.firstFilterProperty.value !== filteringOptions.None ? this.firstFilterValue.value : ''
    };
    this.changeFilterInConfig.emit(this.config);
  }

  private createFilterFieldInConfigForHeader() {
    const newConfig = R.assoc('filter', <GridColumnFilter>{
      type: this.config.filter.type,
      isFiltered: this.firstFilterProperty.value !== filteringOptions.None,
      condition: {
        filterValue: this.firstFilterProperty.value !== filteringOptions.None ? this.firstFilterValue.value : '',
        filterKey: this.firstFilterProperty.value
      }
    }, this.config);
    this.changeFilterInConfig.emit(newConfig);
  }
}
