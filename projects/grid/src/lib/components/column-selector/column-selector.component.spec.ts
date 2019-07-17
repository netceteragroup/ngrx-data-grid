import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ColumnSelectorComponent } from './column-selector.component';

describe('ColumnSelectorComponent', () => {
  let component: ColumnSelectorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColumnSelectorComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    component = TestBed.createComponent(ColumnSelectorComponent).componentInstance;
    spyOn(component.toggleColumnVisibility, 'emit');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when column is toggled', () => {
    // given
    const index = 0;

    // when
    component.toggleColumn(index);

    // then
    expect(component.toggleColumnVisibility.emit).toHaveBeenCalledWith(index);
  });
});
