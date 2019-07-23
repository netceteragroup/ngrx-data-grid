import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterComponent } from './filter.component';
import { FilterCondition, FilteringOptions, FilterType, getFilterOptions } from '../../models';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  const filterType = FilterType.Text;
  const condition: FilterCondition = {option: FilteringOptions.Contains, value: 'test'};

  const mockForm = new FormGroup({
    option: new FormControl(condition.option),
    value: new FormControl(condition.value)
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      providers: [],
      imports: [NgbModule],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    component.type = filterType;
    component.condition = condition;
    spyOn(component.applyFilter, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return false when type is not DateFilterType', () => {
    expect(component.dateFilter).toBeFalsy();
  });

  it('should get type for the input property', () => {
    // given
    fixture.detectChanges();
    const input = fixture.debugElement.nativeElement.querySelector('input').type;

    // then
    expect(component.inputType).toEqual(input);
  });

  it('should create form group', () => {
    // when
    component.ngOnInit();

    // then
    expect(component.filterOptions).toBeDefined();
    expect(component.filterOptions.length !== 0).toBeTruthy();
    expect(component.filterOptions).toEqual(getFilterOptions(FilterType.Text));
    expect(component.form.value).toEqual(mockForm.value);
  });

  it('should emit change when filter config has changed', () => {
    // given
    component.ngOnInit();

    // when
    component.onApplyFilter();

    // then
    expect(component.applyFilter.emit).toHaveBeenCalledWith({option: FilteringOptions.Contains, value: 'test'});
  });

  it('should remove filter', () => {
    // given
    component.ngOnInit();

    // when
    component.removeFilter();

    // then
    expect(component.applyFilter.emit).toHaveBeenCalledWith({option: FilteringOptions.None, value: null});
  });
});
