import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridHeaderComponent } from './grid-header.component';

describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;

  const columns = [{columnId: 'id-0', field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true, component: {}}];

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
    component.columns = columns;
    spyOn(component.toggleSelectAllRows, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when row/s is toggled', () => {
    // when
    component.onToggleSelectAllRows();

    // then
    expect(component.toggleSelectAllRows.emit).toHaveBeenCalled();
  });

});
