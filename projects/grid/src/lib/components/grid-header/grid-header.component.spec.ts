import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridHeaderComponent } from './grid-header.component';
import { ColumnConfig, FilterType } from '../../config';

class MockPriceComponent {
}

describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;

  const mockConfig: ColumnConfig = {
    headerName: 'id',
    field: 'userId',
    component: MockPriceComponent,
    isVisible: false,
    sortable: true,
    filter: {
      type: FilterType.TextFilterType
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridHeaderComponent],
      imports: [NgbModule],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(GridHeaderComponent);
    component = fixture.componentInstance;
    component.header = mockConfig;
    spyOn(component.sortGrid, 'emit');
    spyOn(component.filterGrid, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when sorting is called', () => {
    // when
    component.onSortGrid();

    // then
    expect(component.sortGrid.emit).toHaveBeenCalledWith({
      ...mockConfig,
      sortType: 'DESC'
    });
  });

  it('should emit config when filter event is called', () => {
    // when
    component.changeFilterInConfig(mockConfig);

    // then
    expect(component.filterGrid.emit).toHaveBeenCalledWith(mockConfig);
  });

});
