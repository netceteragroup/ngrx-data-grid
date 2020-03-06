import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { GridRowComponent } from './grid-row.component';
import { DataGridColumnWithId, GridCell } from '../../models';
import { GridConfigBuilder, SelectionType } from '../../config';

class MockCell implements GridCell {
  data: any;
}

describe('GridRowComponent', () => {
  let fixture: ComponentFixture<GridRowComponent>;
  let component: GridRowComponent;

  const data = {
    id: 'd66f8066-547f-41ff-b9b8-ae3a0e10705d',
    mail: 'uzimmerman0@goo.gl',
    age: 43
  };

  const columns: DataGridColumnWithId[] = [
    {
      headerName: 'id',
      field: 'userId',
      component: MockCell,
      visible: false,
      sortAvailable: true,
      filterAvailable: true,
      columnId: 'c1'
    },
    {
      headerName: 'mail',
      field: 'mail',
      component: MockCell,
      visible: false,
      sortAvailable: true,
      filterAvailable: true,
      columnId: 'c2'
    },
    {
      headerName: 'age',
      field: 'age',
      component: MockCell,
      visible: false,
      sortAvailable: true,
      filterAvailable: true,
      columnId: 'c3'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridRowComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(GridRowComponent);

    component = fixture.componentInstance;
    component.columns = columns;
    component.data = data;
    component.rowIndex = 2;
    component.config = GridConfigBuilder.gridConfig().withSelection(SelectionType.Checkbox).build();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event ', () => {
    // given
    spyOn(component.toggleRow, 'emit');

    // when
    component.toggleRowSelection();

    // then
    expect(component.toggleRow.emit).toHaveBeenCalledWith({dataItem: component.data, selectionType: component.selectionType});
  });

  it('should return column data', () => {
    // given
    const expected = 43;

    // when
    const result = component.getColumnData(columns[2]);

    // then
    expect(result).toEqual(expected);
  });

  it('should emit event when the detailed grid is toggled on or off', () => {
    // given
    spyOn(component.toggleDetails, 'emit');

    // when
    component.onToggleDetails();

    // then
    expect(component.toggleDetails.emit).toHaveBeenCalledWith({
      rowData: component.data,
      rowIndex: component.rowIndex,
      active: false,
      name: 'detail-grid-2'
    });
  });

  it('should set detail grid style when the columns are changed, checkbox selection is enabled and and master detail mode is enabled', () => {
    // given
    const newColumns = [{visible: true}, {visible: false}, {visible: true}] as DataGridColumnWithId[];
    const changes = {columns: new SimpleChange([], newColumns, false)};

    component.columns = newColumns;
    component.config.selection.type = SelectionType.Checkbox;
    component.config.masterDetail = true;

    const expected = {
      'grid-column-start': 1,
      'grid-column-end': 5,
      padding: '10px 30px'
    };

    // when
    component.ngOnChanges(changes);

    // then
    expect(component.detailGridStyle).toEqual(expected);
  });

  it('should set detail grid style when the columns are changed and master detail is enabled', () => {
    // given
    const newColumns = [{visible: false}, {visible: false}, {visible: true}] as DataGridColumnWithId[];
    const changes = {columns: new SimpleChange([], newColumns, false)};
    component.config.masterDetail = true;

    component.columns = newColumns;
    component.config.selection.type = null;
    component.config.masterDetail = true;

    const expected = {
      'grid-column-start': 1,
      'grid-column-end': 3,
      padding: '10px 30px'
    };

    // when
    component.ngOnChanges(changes);

    // then
    expect(component.detailGridStyle).toEqual(expected);
  });

});
