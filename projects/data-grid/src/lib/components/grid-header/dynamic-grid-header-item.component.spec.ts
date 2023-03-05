import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicGridHeaderItemComponent } from './dynamic-grid-header-item.component';
import { FilteringOptions, SortType } from '../../models';

describe('DynamicGridHeaderItemComponent', () => {
  let component: DynamicGridHeaderItemComponent;
  let fixture: ComponentFixture<DynamicGridHeaderItemComponent>;

  const column = {
    columnId: 'id-0',
    field: 'id',
    headerName: 'id',
    visible: true,
    sortAvailable: true,
    filterAvailable: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicGridHeaderItemComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(DynamicGridHeaderItemComponent);
    component = fixture.componentInstance;
    component.column = column;

    spyOn(component.sortGrid, 'emit');
    spyOn(component.filterGrid, 'emit');
  });

  it('should emit event when sorting is applied', () => {
    // when
    component.onApplySort();

    // then
    expect(component.sortGrid.emit).toHaveBeenCalledWith({sortType: SortType.Descending, columnId: 'id-0'});
  });

  it('should emit event when filter is applied', () => {
    // when
    const condition: any = {option: FilteringOptions.Contains, value: 'test'};
    component.onApplyFilter(condition);

    // then
    expect(component.filterGrid.emit).toHaveBeenCalledWith({columnId: 'id-0', option: FilteringOptions.Contains, value: 'test'});
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

  it('should return filter visible = true when filter is available and expanded', () => {
    // given
    component.filterExpanded = true;
    const condition: any = {option: FilteringOptions.Contains, value: 'test'};

    // when
    component.onApplyFilter(condition);

    // then
    expect(component.isFilterVisible()).toEqual(true);
  });

});
