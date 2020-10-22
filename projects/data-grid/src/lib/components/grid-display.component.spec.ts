import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { GridDisplayComponent } from './grid-display.component';
import { DataGridColumnWithId, GridCell } from '../models';
import { GridConfigBuilder, SelectionType } from '../config';

class MockCellComponent implements GridCell {
  data: any;
}

describe('GridDisplayComponent', () => {

  let fixture: ComponentFixture<GridDisplayComponent>;
  let component: GridDisplayComponent;

  const columns = [
    {
      columnId: 'userId-0',
      field: 'userId',
      headerName: 'userId',
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      component: MockCellComponent
    },
    {
      columnId: 'mail-1',
      field: 'mail',
      headerName: 'mail',
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      component: MockCellComponent
    },
    {
      columnId: 'age-2',
      field: 'age',
      headerName: 'age',
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      component: MockCellComponent
    }
  ];

  const mockData = [
    {
      'userId': 'd66f8066-547f-41ff-b9b8-ae3a0e10705d',
      'mail': 'uzimmerman0@goo.gl',
      'age': 43
    },
    {
      'userId': '5f71e5ad-0061-4611-b43f-7691a4685628',
      'mail': 'bgrotty1@goo.ne.jp',
      'age': 36
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridDisplayComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(GridDisplayComponent);
    component = fixture.componentInstance;

    component.gridRows = mockData;
    component.columns = columns;
    component.rowDataIndexes = [0, 1];
    component.selectedRowIndexes = [0];
    component.children = ['detail-grid-1'];
    component.config = GridConfigBuilder.gridConfig().withSelection(SelectionType.Checkbox).build();

    spyOn(component.toggleRow, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if a checkbox is selected', () => {
    // given
    const index = 0;

    // when
    const result = component.checkSelected(index);

    // then
    expect(result).toBe(true);
  });

  it('should return false if a checkbox is not selected', () => {
    // given
    const index = 1;

    // when
    const result = component.checkSelected(index);

    // then
    expect(result).toBe(false);
  });

  it('should set columns style when the columns are changed', () => {
    // given
    const newColumns = [{visible: true}, {width: 250, visible: false}, {width: 300, visible: true}] as DataGridColumnWithId[];
    const changes = {columns: new SimpleChange([], newColumns, false)};

    component.columns = newColumns;
    component.config.selection.type = SelectionType.Checkbox;

    const expected = {'grid-template-columns': '3rem minmax(150px, 1.4fr) 300px'};

    // when
    component.ngOnChanges(changes);

    // then
    expect(component.columnsStyle).toEqual(expected);
  });

  it('should return true if a the gird supports checkbox selection', () => {
    // when
    const result = component.hasCheckboxSelection();

    // then
    expect(result).toBe(true);
  });

  it('should return false if a the gird doesnt supports checkbox selection', () => {
    // given
    component.config.selection.type = SelectionType.Radio;

    // when
    const result = component.hasCheckboxSelection();

    // then
    expect(result).toBe(false);
  });

  it('should emit event when row/s is toggled', () => {
    // given
    spyOn(component.toggleSelectAllRows, 'emit');

    // when
    component.onToggleSelectAllRows();

    // then
    expect(component.toggleSelectAllRows.emit).toHaveBeenCalled();
  });

  it('should return true if a row at a given index is expanded', () => {
    // given
    component.config.masterDetail = true;
    const index = 1;

    // when
    const result = component.isDetailGridVisible(index);

    // then
    expect(result).toBe(true);
  });

  it('should return false if the grid doesnt support nested grids', () => {
    // given
    component.config.masterDetail = false;
    const index = 1;

    // when
    const result = component.isDetailGridVisible(index);

    // then
    expect(result).toBe(false);
  });

  it('should return false if a row at a given index is not expanded', () => {
    // given
    component.config.masterDetail = true;
    const index = 0;

    // when
    const result = component.isDetailGridVisible(index);

    // then
    expect(result).toBe(false);
  });

  it('should emit event when column is reordered', () => {
    // given
    spyOn(component.dropColumn, 'emit');

    // when
    component.onDrop({currentIndex: 1, previousIndex: 2});

    // then
    expect(component.dropColumn.emit).toHaveBeenCalled();
  });
});
