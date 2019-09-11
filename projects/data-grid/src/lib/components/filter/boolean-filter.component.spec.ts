import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { FilteringOptions } from '../../models';
import { BooleanFilterComponent } from './boolean-filter.component';

describe('BooleanFilterComponent', () => {
  let component: BooleanFilterComponent;
  let fixture: ComponentFixture<BooleanFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BooleanFilterComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(BooleanFilterComponent);
    component = fixture.componentInstance;
    spyOn(component.valueChanged, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valueChanged when the filter value is changed', () => {
    // given
    component.option = FilteringOptions.True;
    const expectedValue = true;

    // when
    component.ngOnChanges({option: new SimpleChange(null, FilteringOptions.True, false)});

    // then
    expect(component.value).toEqual(expectedValue);
    expect(component.valueChanged.emit).toHaveBeenCalledWith(expectedValue);
  });

  it('should clear the value', () => {
    // given
    component.value = null;

    // when
    component.clear();

    // then
    expect(component.value).toBeNull();
  });

  it('should return true if the value should not be filtered for True option', () => {
    // when
    const result = component.filter({option: FilteringOptions.True, dataItemValue: true});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for True option', () => {
    // when
    const result = component.filter({option: FilteringOptions.True, dataItemValue: false});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for False option', () => {
    // when
    const result = component.filter({option: FilteringOptions.False, dataItemValue: false});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for False option', () => {
    // when
    const result = component.filter({option: FilteringOptions.False, dataItemValue: true});

    // then
    expect(result).toEqual(false);
  });

});
