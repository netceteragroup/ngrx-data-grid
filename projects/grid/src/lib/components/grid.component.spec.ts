import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from '@grid/components/grid.component';
import { Compiler, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { InitGridData, InitColumnConfig, InitGridConfig } from '@grid/store/grid-actions';


class MockCellComponent { }

describe('GridComponent', () => {

  let fixture: ComponentFixture<GridComponent>;
  let component: GridComponent;

  const mockGridConfig = {
    visable: true
  };

  const mockConfig = [{
    headerName: 'id',
    field: 'userId',
    component: MockCellComponent,
    isVisible: false
  }, {
    headerName: 'mail',
    field: 'mail',
    component: MockCellComponent,
    isVisible: false
  }, {
    headerName: 'age',
    field: 'age',
    component: MockCellComponent,
    isVisible: false
  }];

  const mockData = [{
    'userId': 'd66f8066-547f-41ff-b9b8-ae3a0e10705d',
    'mail': 'uzimmerman0@goo.gl',
    'age': 43
  },
    {
      'userId': '5f71e5ad-0061-4611-b43f-7691a4685628',
      'mail': 'bgrotty1@goo.ne.jp',
      'age': 36
    },
    {
      'userId': '5ac87e9f-2163-4fe0-aa98-7adac31fb7b0',
      'mail': 'cevershed2@loc.gov',
      'age': 45
    }];

  const expectedDataAndConfig = [[{
    config: {
      headerName: 'id',
      field: 'userId',
      component: MockCellComponent,
      isVisible: false
    },
    data: 'd66f8066-547f-41ff-b9b8-ae3a0e10705d'
  }, {
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCellComponent,
      isVisible: false
    },
    data: 'uzimmerman0@goo.gl'
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockCellComponent,
      isVisible: false
    },
    data: 43
  }], [{
    config: {
      headerName: 'id',
      field: 'userId',
      component: MockCellComponent,
      isVisible: false
    },
    data: '5f71e5ad-0061-4611-b43f-7691a4685628'
  }, {
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCellComponent,
      isVisible: false
    },
    data: 'bgrotty1@goo.ne.jp'
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockCellComponent,
      isVisible: false
    },
    data: 36
  }], [{
    config: {
      headerName: 'id',
      field: 'userId',
      component: MockCellComponent,
      isVisible: false
    },
    data: '5ac87e9f-2163-4fe0-aa98-7adac31fb7b0'
  }, {
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCellComponent,
      isVisible: false
    },
    data: 'cevershed2@loc.gov'
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockCellComponent,
      isVisible: false
    },
    data: 45
  }]];
  const createMockComponent = () => Component({
    template: ''
  })(MockCellComponent);

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        GridComponent
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

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;

    component.columnConfig = mockConfig;
    component.data = mockData;
    component.config = mockGridConfig;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create component factories', () => {
    // then
    expect(component.componentFactories).toBeTruthy();
    expect(component.componentFactories.length).toEqual(1);
  });

  it('should create dataAndConfig', () => {
    // then
    expect(component.dataAndConfig.length).toEqual(3);
    expect(component.dataAndConfig).toEqual(expectedDataAndConfig);
  });
});
