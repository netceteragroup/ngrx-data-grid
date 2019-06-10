import { GridContainerComponent } from '@grid/containers/grid-container.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { State } from '@grid/store';
import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { cold } from 'jasmine-marbles';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

describe('GridContainerComponent', () => {
  let component: GridContainerComponent;
  let store: Store<GridState>;

  const initialState: State = {
    grid: {
      gridData: [],
      columnConfig: [],
      gridConfig: { visable: true }
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
        GridContainerComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    component = TestBed.createComponent(GridContainerComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the initial values', () => {
    // given
    const expectedData = cold('a', {a: []});
    const expectedColumnConfig = cold('a', {a: []});
    const expectedConfig = cold('a', {a: {visable: true}});

    // then
    expect(component.data$).toBeObservable(expectedData);
    expect(component.columnConfig$).toBeObservable(expectedColumnConfig);
    expect(component.config$).toBeObservable(expectedConfig);
  });

});
