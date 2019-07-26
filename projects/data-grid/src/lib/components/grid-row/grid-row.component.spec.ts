import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridRowComponent } from './grid-row.component';
import { DataGridColumn } from '../../models';

class MockCell {
}

class MockText {
}

describe('GridRowComponent', () => {
  let fixture: ComponentFixture<GridRowComponent>;
  let component: GridRowComponent;

  const data = {
    id: 'd66f8066-547f-41ff-b9b8-ae3a0e10705d',
    mail: 'uzimmerman0@goo.gl',
    age: 43
  };

  const columns: DataGridColumn[] = [
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
      component: MockText,
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

    component.componentFactories = <any>[{
      componentType: {
        name: 'MockCell'
      }
    }, {
      componentType: {
        name: 'MockCell'
      }
    }];

    spyOn(component.toggleRow, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return component factory', () => {
    // then
    expect(component.getComponent(<any>{
      component: MockCell
    })).toEqual(<any>{
      componentType: {
        name: 'MockCell'
      }
    });
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
