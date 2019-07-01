import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';
import { InitGrid } from '@grid/actions/grid-actions';
import { Store, StoreModule } from '@ngrx/store';
import { State } from '@grid/store';
import { gridReducer, GridState } from '@grid/store/grid-reducer';

describe('AppComponent', () => {
  let store: Store<GridState>;
  let component: AppComponent;

  const gridDataExample: Object[] = [
    {
      gridRowId: 0,
      foo: 'one',
      bar: 'two'
    },
    {
      gridRowId: 1,
      foo: 'test',
      bar: 'dat'
    }
  ];
  const columnConfigExample: ColumnConfig[] = [
    {
      headerName: 'Header1',
      field: 'foo',
      component: null,
      isVisible: true,
      sortable: true
    },
    {
      headerName: 'Header2',
      field: 'bar',
      component: null,
      isVisible: false,
      sortable: true
    }
  ];

  const gridConfigExample: GridConfig = {
    visible: false,
    checkboxSelection: true,
    selectedRowsIds: [],
    pagination: {
      paginationPageSize: 0,
      paginationPageSizeValues: [],
      enabled: false,
      currentPage: 0,
      numberOfPages: 1
    }
  };
  const initialState: State = {
    grid: {
      initialData: [],
      gridData: [],
      columnConfig: [],
      pagedData: [],
      gridConfig: {
        visible: true,
        checkboxSelection: true,
        selectedRowsIds: [],
        pagination: {
          paginationPageSize: 0,
          paginationPageSizeValues: [],
          enabled: false,
          currentPage: 0,
          numberOfPages: 1
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          grid: gridReducer
        }, {initialState})
      ],
      declarations: [
        AppComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();
    component = TestBed.createComponent(AppComponent).componentInstance;
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should dispatch init grid when gridInit function is called', () => {
    // given
    const action = new InitGrid({initialData: gridDataExample, columnConfig: columnConfigExample, gridConfig: gridConfigExample});

    // when
    component.initGrid(gridDataExample, columnConfigExample, gridConfigExample);

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
