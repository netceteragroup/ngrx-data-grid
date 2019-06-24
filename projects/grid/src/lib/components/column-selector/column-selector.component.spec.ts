import { ColumnSelectorComponent } from '@grid/components/column-selector/column-selector.component';
import { ColumnConfig } from '@grid/config/column-config';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { State } from '@grid/store';
import { gridReducer, GridState } from '@grid/store/grid-reducer';
import { ToggleColumnVisibility } from '@grid/actions/grid-actions';

describe('ColumnSelectorComponent', () => {
  let component: ColumnSelectorComponent;
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
          currentPage: 0,
          numberOfPages: 0
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
        ColumnSelectorComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    component = TestBed.createComponent(ColumnSelectorComponent).componentInstance;
    spyOn(store, 'dispatch');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch action when a column is toggled', () => {
    // given
    const action = new ToggleColumnVisibility(1);

    // when
    component.toggleColumn(1);

    // then
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
