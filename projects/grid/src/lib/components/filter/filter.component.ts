import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ColumnConfig } from '@grid/config/column-config';
import * as R from 'ramda';
import { FilterOptionsService } from '@grid/services/filter-options/filter-options.service';
import { FilteringOptions, FilterType } from '@grid/config/filter-config';

@Component({
  selector: 'pcs-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
  @Input() config: ColumnConfig;
  @Output() changeFilterInConfig: EventEmitter<ColumnConfig> = new EventEmitter<ColumnConfig>();

  filterOptions: string[];
  form: FormGroup;
  firstFilterProperty: FormControl;
  firstFilterValue: FormControl;

  constructor(private filterOptionsService: FilterOptionsService) {
  }

  get inputType() {
    if (this.config.filter) {
      return this.config.filter.type === FilterType.TextFilterType ? 'text' : 'number';
    }
  }

  get isDateField() {
    return this.config.filter.type === FilterType.DateFilterType;
  }

  get isBoolean() {
    return this.config.filter.type === FilterType.BooleanFilterType;
  }

  ngOnInit(): void {
    R.cond([
      [R.equals(FilterType.NumberFilterType), () => this.filterOptions = this.filterOptionsService.numberFilterOptions],
      [R.equals(FilterType.DateFilterType), () => this.filterOptions = this.filterOptionsService.dateFilterOptions],
      [R.equals(FilterType.BooleanFilterType), () => this.filterOptions = this.filterOptionsService.booleanFilterOptions],
      [R.T, () => this.filterOptions = this.filterOptionsService.textFilterOptions]
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
    this.firstFilterProperty.setValue(FilteringOptions.None);
    this.firstFilterValue.setValue(null);
    this.emitChangeInFilterConfig();
  }

  private createFormControls() {
    this.firstFilterProperty = new FormControl(this.config.filter.condition ? this.config.filter.condition.filterKey : FilteringOptions.None);
    this.firstFilterValue = new FormControl(this.config.filter.condition ? this.config.filter.condition.filterValue : '');
  }

  private createFormGroup() {
    this.form = new FormGroup({
      firstFilterProperty: this.firstFilterProperty,
      firstFilterValue: this.firstFilterValue
    });
  }

  private createNewFilterConfig = (): ColumnConfig => <ColumnConfig>R.mergeDeepRight(this.config, {
    filter: {
      isFiltered: this.firstFilterProperty.value !== FilteringOptions.None,
      condition: {
        filterKey: this.firstFilterProperty.value,
        filterValue: !this.isBoolean ? this.firstFilterProperty.value !== FilteringOptions.None ? this.firstFilterValue.value : '' : R.toLower(this.firstFilterProperty.value) === 'true'
      }
    }
  })

  private emitChangeInFilterConfig() {
    if (this.firstFilterProperty.value === FilteringOptions.None) {
      this.firstFilterValue.setValue(null);
    }
    const newConfig = this.createNewFilterConfig();
    this.changeFilterInConfig.emit(newConfig);
  }

  private createFilterFieldInConfigForHeader() {
    const newConfig = this.createNewFilterConfig();
    this.changeFilterInConfig.emit(newConfig);
  }
}
