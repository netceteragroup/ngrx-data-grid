import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ColumnSelectorComponent } from './column-selector.component';

describe('ColumnSelectorComponent', () => {
  let component: ColumnSelectorComponent;

  const columns = [
    {columnId: 'id-0', field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true, component: {}},
    {columnId: 'name-1', field: 'name', headerName: 'name', visible: true, sortAvailable: true, filterAvailable: true, component: {}},
    {columnId: 'value-2', field: 'value', headerName: 'value', visible: true, sortAvailable: true, filterAvailable: true, component: {}}
  ];

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
    component.columns = columns;
    spyOn(component.toggleColumnVisibility, 'emit');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when column is toggled', () => {
    // when
    component.toggleColumn(columns[0]);

    // then
    expect(component.toggleColumnVisibility.emit).toHaveBeenCalledWith('id-0');
  });
});
