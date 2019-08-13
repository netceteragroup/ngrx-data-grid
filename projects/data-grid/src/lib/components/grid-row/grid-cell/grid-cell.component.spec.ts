import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridCellComponent } from './grid-cell.component';
import { ComponentFactoryResolver } from '@angular/core';
import { DataGridColumnWithId, GridCell } from '../../../models';

class CellComponentMock implements GridCell {
  data: any;
}

describe('GridCellComponent', () => {
  let fixture: ComponentFixture<any>;
  let component: GridCellComponent;

  const componentFactoryResolverMock = {
    resolveComponentFactory: jasmine.createSpy('resolveComponentFactory')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridCellComponent],
      providers: [
        {
          provide: ComponentFactoryResolver,
          useValue: componentFactoryResolverMock
        }
      ]
    });
    fixture = TestBed.createComponent(GridCellComponent);
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
    expect(componentFactoryResolverMock.resolveComponentFactory).toHaveBeenCalled();
    expect(component.cellHost.createComponent).toHaveBeenCalled();
  });
});
