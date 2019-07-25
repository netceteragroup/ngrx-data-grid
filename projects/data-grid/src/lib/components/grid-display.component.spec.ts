import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Compiler, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { GridDisplayComponent } from './grid-display.component';
import { EntryComponentsService } from '../services';
import { FilterType } from '../models';

class MockCellComponent {
}

describe('GridDisplayComponent', () => {

  let fixture: ComponentFixture<GridDisplayComponent>;
  let component: GridDisplayComponent;

  const columns = [
    {columnId: 'userId-0', field: 'userId', headerName: 'userId', visible: true, sortAvailable: true, filterAvailable: true, component: {}},
    {columnId: 'mail-1', field: 'mail', headerName: 'mail', visible: true, sortAvailable: true, filterAvailable: true, component: {}},
    {columnId: 'age-2', field: 'age', headerName: 'age', visible: true, sortAvailable: true, filterAvailable: true, component: {}}
  ];

  const mockData = [{
    'userId': 'd66f8066-547f-41ff-b9b8-ae3a0e10705d',
    'mail': 'uzimmerman0@goo.gl',
    'age': 43
  },
    {
      'userId': '5f71e5ad-0061-4611-b43f-7691a4685628',
      'mail': 'bgrotty1@goo.ne.jp',
      'age': 36
    }];

  const mockConfig = [{
    headerName: 'id',
    field: 'userId',
    component: MockCellComponent,
    isVisible: false,
    sortable: true,
    filter: {
      type: FilterType.Text,
      isFiltered: false
    },
  }, {
    headerName: 'mail',
    field: 'mail',
    component: MockCellComponent,
    isVisible: true,
    sortable: true,
    filter: {
      type: FilterType.Text,
      isFiltered: false
    }
  }, {
    headerName: 'age',
    field: 'age',
    component: MockCellComponent,
    isVisible: true,
    sortable: true,
    filter: {
      type: FilterType.Number,
      isFiltered: false
    }
  }];
  const expectedDataAndConfig = [[{
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCellComponent,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.Text,
        isFiltered: false
      }
    },
    data: 'uzimmerman0@goo.gl',
    dataItem: mockData[0]
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockCellComponent,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.Number,
        isFiltered: false
      }
    },
    data: 43,
    dataItem: mockData[0]
  }], [{
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCellComponent,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.Text,
        isFiltered: false
      }
    },
    data: 'bgrotty1@goo.ne.jp',
    dataItem: mockData[1]
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockCellComponent,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.Number,
        isFiltered: false
      }
    },
    data: 36,
    dataItem: mockData[1]
  }]];
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

    component.columnConfig = mockConfig;
    component.pagedData = mockData;
    component.columns = columns;

    spyOn(component.pageNumChange, 'emit');
    spyOn(component.pageSizeChange, 'emit');
    spyOn(component.sortGrid, 'emit');
    spyOn(component.toggleColumnVisibility, 'emit');
    spyOn(component.toggleRow, 'emit');
    spyOn(component.toggleSelectAllRows, 'emit');
    spyOn(component.filterGrid, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create component factories', () => {
    expect(component.componentFactories).toBeTruthy();
    expect(component.componentFactories.length).toEqual(1);
  });

  it('should create dataAndConfig', () => {
    expect(component.dataAndConfig.length).toEqual(2);
    expect(component.dataAndConfig).toEqual(expectedDataAndConfig);
  });

  it('should emit change in page size', () => {
    // given
    const pageSize = 4;

    // when
    component.sendNewPageSize(pageSize);

    // then
    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(pageSize);
  });

  it('should emit change in page number', () => {
    // given
    const pageNum = 5;

    // when
    component.sendNewPageNum(pageNum);

    // then
    expect(component.pageNumChange.emit).toHaveBeenCalledWith(pageNum);
  });

  it('should emit sortGrid event', () => {
    // given
    const sort: any = {columnId: 'userId-0', sortType: 'ASC'};

    // when
    component.onSortGrid(sort);

    // then
    expect(component.sortGrid.emit).toHaveBeenCalledWith(sort);
  });

  it('should emit filterGrid event', () => {
    // given
    const filter: any = {columnId: 'userId-0', filterType: 'Text', condition: {option: 'Contains', value: 'test'}};

    // when
    component.onFilterGrid(filter);

    // then
    expect(component.filterGrid.emit).toHaveBeenCalledWith(filter);
  });

  it('should emit event when a columns\' visibility is toggled', () => {
    // given
    const columnId = 'userId-0';

    // when
    component.onToggleColumn(columnId);

    // then
    expect(component.toggleColumnVisibility.emit).toHaveBeenCalledWith(columnId);
  });

  it('should emit event when row/s is toggled', () => {
    // given
    const index = 1;

    // when
    component.onToggleSelectAllRows();
    component.onToggleRow(index);

    // then
    expect(component.toggleRow.emit).toHaveBeenCalled();
    expect(component.toggleSelectAllRows.emit).toHaveBeenCalled();
  });
});
