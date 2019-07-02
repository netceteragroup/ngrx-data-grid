import { GridComponent } from '@grid/containers/grid.component';
import { ColumnConfig } from '@grid/config/column-config';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { State } from '@grid/store';
import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { cold } from 'jasmine-marbles';
import { ChangePageNumber, ChangePageSize, FilterGrid, SortGrid, ToggleRowSelection, ToggleSelectAllRows } from '@grid/actions/grid-actions';
import { FilteringOptions, FilterType } from '@grid/config/filter-config';

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
        selection: {
          checkboxSelection: true,
          selectedRowsIds: []
        },
        pagination: {
          paginationPageSize: 0,
          paginationPageSizeValues: [],
          enabled: false,
          currentPage: 0,
          numberOfPages: 0
        }
      }
    }
  };

  const mockConfigItem: ColumnConfig = {
    component: null,
    field: 'mock',
    headerName: 'Mock',
    isVisible: true,
    sortable: true,
    filter: {
      type: FilterType.TextFilterType
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
    const mockPagination = {
      paginationPageSize: 0,
      paginationPageSizeValues: [],
      enabled: false,
      currentPage: 0,
      numberOfPages: 0
    };

    const expectedColumnConfig = cold('a', {a: []});
    const expectedSelection = cold('a', {
      a: {
        checkboxSelection: true,
        selectedRowsIds: []
      }
    });

    const expectedPagination = cold('a', {
      a: mockPagination
    });

    const expectedPagedData = cold('a', {
      a: []
    });

    // then
    expect(component.columnConfig$).toBeObservable(expectedColumnConfig);
    expect(component.selection$).toBeObservable(expectedSelection);
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

  it('should dispatch SortGrid action when grid sorting is called', () => {
    // given
    const action = new SortGrid(mockConfigItem);

    // when
    component.onSortGrid(mockConfigItem);

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

  it('should dispatch ToggleRowSelection action when a row is toggled', () => {
    // given
    const index = 1;
    const action = new ToggleRowSelection(index);

    // when
    component.onToggleRow(index);

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch ToggleSelectAllRows action when a all rows are toggled', () => {
    // given
    const action = new ToggleSelectAllRows();

    // when
    component.onToggleSelectAllRows();

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch FilterGrid when filter has been updated', () => {
    // given
    const configWithFilter = {
      ...mockConfigItem,
      filter: {
        type: FilterType.TextFilterType,
        isFiltered: true,
        condition: {
          filterKey: FilteringOptions.Contains,
          filterValue: 'aAbB'
        }
      }
    };
    const action = new FilterGrid(configWithFilter);

    // when
    component.changeFilterInConfig(configWithFilter);

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
