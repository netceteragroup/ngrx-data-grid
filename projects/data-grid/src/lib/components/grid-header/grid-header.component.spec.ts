import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridHeaderComponent } from './grid-header.component';

describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;

  const column = {columnId: 'id-0', field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true, component: {}};

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
    component.column = column;
    spyOn(component.sortGrid, 'emit');
    spyOn(component.filterGrid, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
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

});
