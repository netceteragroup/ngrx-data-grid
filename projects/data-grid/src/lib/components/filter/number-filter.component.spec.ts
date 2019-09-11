import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilteringOptions } from '../../models';
import { NumberFilterComponent } from './number-filter.component';

describe('NumberFilterComponent', () => {
  let component: NumberFilterComponent;
  let fixture: ComponentFixture<NumberFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NumberFilterComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(NumberFilterComponent);
    component = fixture.componentInstance;
    spyOn(component.valueChanged, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valueChanged when the filter value is changed', () => {
    // given
    const expectedValue = 2;

    // when
    component.updateValue({target: {value: expectedValue}});

    // then
    expect(component.value).toEqual(expectedValue);
    expect(component.valueChanged.emit).toHaveBeenCalledWith(expectedValue);
  });

  it('should clear the value', () => {
    // given
    component.value = 3;

    // when
    component.clear();

    // then
    expect(component.value).toBeNull();
  });

  it('should return true if the value should not be filtered for GreaterThan option', () => {
    // when
    const result = component.filter({option: FilteringOptions.GreaterThan, value: 3, dataItemValue: 6});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for GreaterThan option', () => {
    // when
    const result = component.filter({option: FilteringOptions.GreaterThan, value: 4, dataItemValue: 1});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for Equals option', () => {
    // when
    const result = component.filter({option: FilteringOptions.Equals, value: 2, dataItemValue: 2});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for Equals option', () => {
    // when
    const result = component.filter({option: FilteringOptions.Equals, value: 1, dataItemValue: 3});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for NotEqual option', () => {
    // when
    const result = component.filter({option: FilteringOptions.NotEqual, value: 2, dataItemValue: 3});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for NotEqual option', () => {
    // when
    const result = component.filter({option: FilteringOptions.NotEqual, value: 1, dataItemValue: 1});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for LessThan option', () => {
    // when
    const result = component.filter({option: FilteringOptions.LessThan, value: 2, dataItemValue: 1});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for LessThan option', () => {
    // when
    const result = component.filter({option: FilteringOptions.LessThan, value: 3, dataItemValue: 3});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for LessThanOrEqual option', () => {
    // when
    const result = component.filter({option: FilteringOptions.LessThanOrEqual, value: 5, dataItemValue: 5});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for LessThanOrEqual option', () => {
    // when
    const result = component.filter({option: FilteringOptions.LessThanOrEqual, value: 3, dataItemValue: 4});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for GreaterThanOrEquals option', () => {
    // when
    const result = component.filter({option: FilteringOptions.GreaterThanOrEquals, value: 5, dataItemValue: 7});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for GreaterThanOrEquals option', () => {
    // when
    const result = component.filter({option: FilteringOptions.GreaterThanOrEquals, value: 9, dataItemValue: 4});

    // then
    expect(result).toEqual(false);
  });

});
