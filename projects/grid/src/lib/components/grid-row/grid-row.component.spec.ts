import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridRowComponent } from '@grid/components/grid-row/grid-row.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterType } from '@grid/config/filter-config';

class MockCell {
}

class MockText {
}

describe('GridRowComponent', () => {
  let fixture: ComponentFixture<GridRowComponent>;
  let component: GridRowComponent;

  const expectedDataAndConfig = [{
    config: {
      headerName: 'id',
      field: 'userId',
      component: MockCell,
      isVisible: false,
      sortable: true,
      filter: {
        type: FilterType.TextFilterType
      }
    },
    data: 'd66f8066-547f-41ff-b9b8-ae3a0e10705d'
  }, {
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCell,
      isVisible: false,
      sortable: true,
      filter: {
        type: FilterType.TextFilterType
      }
    },
    data: 'uzimmerman0@goo.gl'
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockText,
      isVisible: false,
      sortable: true,
      filter: {
        type: FilterType.NumberFilterType
      }
    },
    data: 43
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridRowComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(GridRowComponent);

    component = fixture.componentInstance;
    component.dataAndConfig = expectedDataAndConfig;

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

});
