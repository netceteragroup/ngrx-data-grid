import { GridComponent } from '@grid/containers/grid.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { State } from '@grid/store';
import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { cold } from 'jasmine-marbles';

describe('GridComponent', () => {
  let component: GridComponent;
  let store: Store<GridState>;

  const initialState: State = {
    grid: {
      initialData: [],
      gridData: [],
      columnConfig: [],
      gridConfig: { visible: true }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          grid: gridReducer
        }, {initialState})
      ],
      declarations: [
        GridComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    component = TestBed.createComponent(GridComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the initial values', () => {
    // given
    const expectedData = cold('a', {a: []});
    const expectedColumnConfig = cold('a', {a: []});
    const expectedConfig = cold('a', {a: {visible: true}});

    // then
    expect(component.data$).toBeObservable(expectedData);
    expect(component.columnConfig$).toBeObservable(expectedColumnConfig);
    expect(component.config$).toBeObservable(expectedConfig);
  });

});
