import { GridComponent } from '@grid/containers/grid.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { State } from '@grid/store';
import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { cold } from 'jasmine-marbles';
import { ChangePageNumber, ChangePageSize } from '@grid/actions/grid-actions';

describe('GridComponent', () => {
  let component: GridComponent;
  let store: Store<GridState>;

  const initialState: State = {
    grid: {
      initialData: [],
      gridData: [],
      columnConfig: [],
      pagedData: [],
      gridConfig: {
        visible: true,
        pagination: {
          paginationPageSize: 0,
          paginationPageSizeValues: [],
          enabled: false,
          currentPage: 0
        }
      }
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
    spyOn(store, 'dispatch');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the initial values', () => {
    // given
    const expectedData = cold('a', {a: []});
    const expectedColumnConfig = cold('a', {a: []});
    const expectedConfig = cold('a', {
      a: {
        visible: true,
        pagination: {
          paginationPageSize: 0,
          paginationPageSizeValues: [],
          enabled: false,
          currentPage: 0
        }
      }
    });

    const expectedPagination = cold('a', {
      a: {
        paginationPageSize: 0,
        paginationPageSizeValues: [],
        enabled: false,
        currentPage: 0
      }
    });

    const expectedPagedData = cold('a', {
      a: []
    });


    // then
    expect(component.data$).toBeObservable(expectedData);
    expect(component.columnConfig$).toBeObservable(expectedColumnConfig);
    expect(component.config$).toBeObservable(expectedConfig);
    expect(component.pagination$).toBeObservable(expectedPagination);
    expect(component.pagedData$).toBeObservable(expectedPagedData);
  });

  it('should dispatch ChangePageSize when new pageSize has been chosen', () => {
    // given
    const pageSize = 4;
    const action = new ChangePageSize(pageSize);

    // when
    component.changePageSize(pageSize);

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch ChangePageNum when a page has been selected', () => {
    // given
    const pageNum = 4;
    const action = new ChangePageNumber(pageNum);

    // when
    component.changePageNum(pageNum);

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
