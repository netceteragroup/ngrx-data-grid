import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Compiler, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { GridDisplayComponent } from './grid-display.component';
import { EntryComponentsService } from '../services';

class MockCellComponent {
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

  const createMockComponent = () => Component({
    template: ''
  })(MockCellComponent);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridDisplayComponent
      ],
      providers: [
        {
          provide: Compiler,
          useValue: {
            compileModuleAndAllComponentsSync: () => ({
              componentFactories: [
                createMockComponent()
              ]
            })
          }
        },
        {
          provide: EntryComponentsService,
          useValue: {
            entryComponentsArray: [
              createMockComponent()
            ]
          }
        }],
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

    spyOn(component.toggleRow, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create component factories', () => {
    expect(component.componentFactories).toBeTruthy();
    expect(component.componentFactories.length).toEqual(1);
  });

  it('should emit event when row/s is toggled', () => {
    // given
    const index = 1;

    // when
    component.onToggleRow(index);

    // then
    expect(component.toggleRow.emit).toHaveBeenCalledWith(mockData[1]);
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

});
