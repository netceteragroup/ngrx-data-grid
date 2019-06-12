import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
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
      foo: 'one',
      bar: 'two'
    },
    {
      foo: 'test',
      bar: 'dat'
    }
  ];
  const columnConfigExample: ColumnConfig[] = [
    {
      headerName: 'Header1',
      field: 'foo',
      component: null,
      isVisible: true
    },
    {
      headerName: 'Header2',
      field: 'bar',
      component: null,
      isVisible: false
    }
  ];
  const gridConfigExample: GridConfig = {
    visible: false
  };
  const initialState: State = {
    grid: {
      initialData: [],
      gridData: [],
      columnConfig: [],
      gridConfig: { visible: true }
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
    const action = new InitGrid(gridDataExample, columnConfigExample, gridConfigExample);

    // when
    component.initGrid(gridDataExample, columnConfigExample, gridConfigExample);

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
