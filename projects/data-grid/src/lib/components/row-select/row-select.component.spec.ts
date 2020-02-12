import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridTranslateService } from '../../services/grid-translate.service';
import { RowSelectComponent } from './row-select.component';
import { SelectionType } from '../../config';

describe('RowSelectComponent', () => {
  let component: RowSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RowSelectComponent
      ],
      providers: [
        GridTranslateService
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    component = TestBed.createComponent(RowSelectComponent).componentInstance;
    spyOn(component.selected, 'emit');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for checkbox selection', () => {
    // given
    component.type = SelectionType.Checkbox;

    // then
    expect(component.isCheckbox()).toBeTruthy();
});

it('should return true for radio selection', () => {
  // given
  component.type = SelectionType.Radio;

  // then
  expect(component.isRadio()).toBeTruthy();
});

  it('should dispatch select action if the component is not selected', () => {
    // given
    component.isSelected = false;

    // when
    component.select();

    // then
    expect(component.selected.emit).toHaveBeenCalled();
  });

  it('should not dispatch select action if the component is already selected', () => {
    // given
    component.isSelected = true;

    // when
    component.select();

    // then
    expect(component.selected.emit).not.toHaveBeenCalled();
  });

});
