import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChange,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ApplyFilterEvent, FilteringOptions, FilterType, GridDataFilter } from '../../models';
import { GridFilter } from './grid-filter';
import { Subscription } from 'rxjs';
import { GridFilterDirective } from './grid-filter.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { LOCALE_TEXT_KEYS } from '../../constants';
import { getFilterComponent } from '../../store/filters-util';
import * as R from 'ramda';

const FILTER_INPUTS = ['value', 'option'];

const createChanges = (keys: string[], prev: any, current: any, firstChange: boolean): SimpleChanges => {
  const changedKeys: string[] = R.filter(key => prev[key] !== current[key], keys);
  if (R.isEmpty(changedKeys)) {
    return {};
  }

  return R.reduce((changes: SimpleChanges, key: string) => R.mergeRight(changes, {
    [key]: new SimpleChange(prev[key], current[key], firstChange)
  }), {}, changedKeys);
};

@Component({
  selector: 'ngrx-dynamic-filter',
  templateUrl: './dynamic-filter.component.html',
  styleUrls: ['./dynamic-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filter: GridDataFilter;
  @Output() apply = new EventEmitter<ApplyFilterEvent>();

  @ViewChild(GridFilterDirective, {read: ViewContainerRef, static: true}) filterHost: ViewContainerRef;

  form: FormGroup;
  filterOptions: string[];
  componentRef: ComponentRef<GridFilter> | null;
  subscription = new Subscription();
  readonly localeTexts = LOCALE_TEXT_KEYS.grid.filter;

  get filterOption() {
    return this.form.get('option') as FormControl;
  }

  get filterValue() {
    return this.form.get('value') as FormControl;
  }

  get filterInstance() {
    return this.componentRef.instance;
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.form = this.createFilterForm();
    this.createFilterComponent();
    this.filterOptions = this.filterInstance.options;

    this.subscription.add(this.filterInstance.valueChanged.subscribe(value => {
      this.filterValue.setValue(value);
    }));
  }

  ngOnChanges({filter: filterChanges}: SimpleChanges): void {
    if (filterChanges && filterChanges.currentValue !== filterChanges.previousValue && !filterChanges.isFirstChange()) {
      this.propagateChanges(this.filter);
      this.filterOption.setValue(this.filter.option);
      this.filterValue.setValue(this.filter.value);
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    this.subscription.unsubscribe();
  }

  onClearFilter() {
    this.form.setValue({
      option: FilteringOptions.None,
      value: null
    });
    this.propagateChanges(this.form.value);
    this.filterInstance.clear();
    this.onApplyFilter();
  }

  onApplyFilter() {
    this.apply.emit(this.form.value);
  }

  onOptionSelected() {
    this.propagateChanges(this.form.value);
  }

  private createFilterForm(): FormGroup {
    return new FormGroup({
      option: new FormControl(this.filter.option || FilteringOptions.None),
      value: new FormControl(this.filter.value)
    });
  }

  private createFilterComponent() {
    this.filterHost.clear();
    this.componentRef = null;

    const component = this.getFilterComponent(this.filter.filterType);
    if (component) {
      this.createComponent(component);
    }
  }

  private isUserDefinedFilter(): boolean {
    return !!this.filter.component;
  }

  private getFilterComponent(filterType: FilterType): Type<GridFilter> {
    if (this.isUserDefinedFilter()) {
      return this.filter.component;
    }

    return getFilterComponent(filterType);
  }

  private createComponent(component: Type<GridFilter>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<GridFilter>(component);
    this.componentRef = this.filterHost.createComponent(componentFactory);
    this.filterInstance.option = this.filter.option;

    if (this.filter.value) {
      this.filterInstance.value = this.filter.value;
    }

    if ((this.filterInstance as any).ngOnInit) {
      (this.filterInstance as any).ngOnInit();
    }
  }

  private propagateChanges(filter) {
    const prev = R.pickAll(FILTER_INPUTS, this.filterInstance);
    const curr = R.pickAll(FILTER_INPUTS, filter);
    this.filterInstance.value = filter.value;
    this.filterInstance.option = filter.option;

    if ((this.filterInstance as any).ngOnChanges) {
      const changes = createChanges(FILTER_INPUTS, prev, curr, false);
      (this.filterInstance as any).ngOnChanges(changes);
    }

    this.componentRef.changeDetectorRef.markForCheck();
  }

}
