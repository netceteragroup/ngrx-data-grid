import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridCellComponent } from '@grid/components/grid-row/grid-cell/grid-cell.component';

class MockCell {
}

describe('GridCellComponent', () => {
  let fixture: ComponentFixture<any>;
  let component: GridCellComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridCellComponent]
    });
    fixture = TestBed.createComponent(GridCellComponent);
    component = fixture.componentInstance;
    component.dataAndConfig = {
      config: {
        headerName: 'id',
        field: 'userId',
        component: MockCell,
        isVisible: false,
        sortable: true
      },
      data: 'd66f8066-547f-41ff-b9b8-ae3a0e10705d'
    };

    component.componentFactory = <any>{
      componentType: {
        name: 'MockCell'
      }
    };

    component.cellHost = <any>{
      clear: jasmine.createSpy('clear'),
      createComponent: jasmine.createSpy('createComponent').and.returnValue({
        instance: {
          data: { }
        }
      })
    };
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke clear and createComponent', () => {
    // when
    component.ngOnInit();

    // then
    expect(component.cellHost.createComponent).toHaveBeenCalledWith(component.componentFactory);
    expect(component.cellHost.clear).toHaveBeenCalled();
  });
});
