import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilteringOptions } from '../../models';
import { TextFilterComponent } from './text-filter.component';

describe('TextFilterComponent', () => {
  let component: TextFilterComponent;
  let fixture: ComponentFixture<TextFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TextFilterComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(TextFilterComponent);
    component = fixture.componentInstance;
    spyOn(component.valueChanged, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valueChanged when the filter value is changed', () => {
    // given
    const expectedValue = 'test';

    // when
    component.updateValue({target: {value: expectedValue}});

    // then
    expect(component.value).toEqual(expectedValue);
    expect(component.valueChanged.emit).toHaveBeenCalledWith(expectedValue);
  });

  it('should clear the value', () => {
    // given
    component.value = 'test';

    // when
    component.clear();

    // then
    expect(component.value).toEqual('');
  });

  it('should return true if the value should not be filtered for Contains option', () => {
    // when
    const result = component.filter({option: FilteringOptions.Contains, value: 'a', dataItemValue: 'sad'});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for Contains option', () => {
    // when
    const result = component.filter({option: FilteringOptions.Contains, value: 'a', dataItemValue: 'bbe'});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for Equals option', () => {
    // when
    const result = component.filter({option: FilteringOptions.Equals, value: 'aa', dataItemValue: 'aa'});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for Equals option', () => {
    // when
    const result = component.filter({option: FilteringOptions.Equals, value: 'aa', dataItemValue: 'bbe'});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for NotEqual option', () => {
    // when
    const result = component.filter({option: FilteringOptions.NotEqual, value: 'aa', dataItemValue: 'a2a'});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for NotEqual option', () => {
    // when
    const result = component.filter({option: FilteringOptions.NotEqual, value: 'aa', dataItemValue: 'aa'});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for NotContains option', () => {
    // when
    const result = component.filter({option: FilteringOptions.NotContains, value: 'v', dataItemValue: 'test'});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for NotContains option', () => {
    // when
    const result = component.filter({option: FilteringOptions.NotContains, value: 'b', dataItemValue: 'aba'});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for StartsWith option', () => {
    // when
    const result = component.filter({option: FilteringOptions.StartsWith, value: 'v', dataItemValue: 'vtest'});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for StartsWith option', () => {
    // when
    const result = component.filter({option: FilteringOptions.StartsWith, value: 'b', dataItemValue: 'hh'});

    // then
    expect(result).toEqual(false);
  });

  it('should return true if the value should not be filtered for EndsWith option', () => {
    // when
    const result = component.filter({option: FilteringOptions.EndsWith, value: 'v', dataItemValue: 'testv'});

    // then
    expect(result).toEqual(true);
  });

  it('should return false if the value should be filtered for EndsWith option', () => {
    // when
    const result = component.filter({option: FilteringOptions.EndsWith, value: 'b', dataItemValue: 'hh'});

    // then
    expect(result).toEqual(false);
  });

});
