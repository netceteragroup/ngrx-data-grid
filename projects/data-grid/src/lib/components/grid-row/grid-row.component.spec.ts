import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridRowComponent } from './grid-row.component';
import { DataGridColumnWithId, GridCell } from '../../models';

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

    spyOn(component.toggleRow, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event ', () => {
    // when
    component.toggleRowSelection();

    // then
    expect(component.toggleRow.emit).toHaveBeenCalled();
  });

  it('should return column data', () => {
    // given
    const expected = 43;

    // when
    const result = component.getColumnData(columns[2]);

    // then
    expect(result).toEqual(expected);
  });

});
