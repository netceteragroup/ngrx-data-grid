import { GridExampleComponent } from '@example/containers/grid-example.component';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { gridExampleReducer, GridExampleState } from '@example/reducers/grid-example';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { State } from '@example/reducers';
import { AddNewColumn, AddNewRow } from '@example/actions/grid-example';

describe('GridExampleComponent', () => {
  let component: GridExampleComponent;
  let store: Store<GridExampleState>;

  const initialState: State = {
    gridExample: {
      columnsNum: 3,
      rowsNum: 4
    }
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          gridExample: gridExampleReducer
        }, {initialState})
      ],
      declarations: [
        GridExampleComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    component = TestBed.createComponent(GridExampleComponent).componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the initial values for rows and columns', fakeAsync(() => {
    component.rowsNum$.subscribe((rowsNum: number) => {
      // then
      expect(rowsNum).toEqual(4);
    });

    component.columnsNum$.subscribe((columnsNum: number) => {
      // then
      expect(columnsNum).toEqual(3);
    });
  }));


  it('should dispatch AddNewRow action when new row is added', () => {
    // given
    const action = new AddNewRow();

    // when
    component.onAddNewRow();

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch AddNewColumn action when new column is added', () => {
    // given
    const action = new AddNewColumn();

    // when
    component.onAddNewColumn();

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
