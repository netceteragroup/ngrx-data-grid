import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridHeaderItemComponent } from './grid-header-item.component';

describe('GridHeaderItemComponent', () => {
  let component: GridHeaderItemComponent;
  let fixture: ComponentFixture<GridHeaderItemComponent>;

  const column = {
    columnId: 'id-0',
    field: 'id',
    headerName: 'id',
    visible: true,
    sortAvailable: true,
    filterAvailable: true,
    component: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridHeaderItemComponent],
      imports: [NgbModule],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(GridHeaderItemComponent);
    component = fixture.componentInstance;
    component.column = column;

    spyOn(component.sortGrid, 'emit');
    spyOn(component.filterGrid, 'emit');
  });

  it('should emit event when sorting is applied', () => {
    // when
    component.onApplySort();

    // then
    expect(component.sortGrid.emit).toHaveBeenCalledWith({sortType: 'DESC', columnId: 'id-0'});
  });

  it('should emit event when filter is applied', () => {
    // when
    const condition: any = {option: 'Contains', value: 'test'};
    component.onApplyFilter(condition);

    // then
    expect(component.filterGrid.emit).toHaveBeenCalledWith({columnId: 'id-0', condition, filterType: null});
  });

  it('should set filterExpanded to true if the filter is expanded', () => {
    // when
    component.toggleExpanded();

    // then
    expect(component.filterExpanded).toEqual(true);
  });

  it('should set filterExpanded to false if the filter is collapsed', () => {
    // given
    component.filterExpanded = true;

    // when
    component.toggleExpanded();

    // then
    expect(component.filterExpanded).toEqual(false);
  });

});
