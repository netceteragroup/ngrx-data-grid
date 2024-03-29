import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicGridCellComponent } from './dynamic-grid-cell.component';
import { DataGridColumnWithId, GridCell } from '../../../models';

class CellComponentMock implements GridCell {
  data: any;
}

describe('DynamicGridCellComponent', () => {
  let fixture: ComponentFixture<any>;
  let component: DynamicGridCellComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicGridCellComponent],
      providers: []
    });
    fixture = TestBed.createComponent(DynamicGridCellComponent);
    component = fixture.componentInstance;
    component.data = 'd66f8066-547f-41ff-b9b8-ae3a0e10705d';

    component.cellHost = <any>{
      clear: jasmine.createSpy('clear'),
      createComponent: jasmine.createSpy('createComponent').and.returnValue({instance: {}})
    };
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create cell component', () => {
    // given
    component.column = {
      component: CellComponentMock
    } as DataGridColumnWithId;

    // when
    fixture.detectChanges();

    // then
    expect(component.cellHost.clear).toHaveBeenCalled();
    expect(component.cellHost.createComponent).toHaveBeenCalled();
  });
});
