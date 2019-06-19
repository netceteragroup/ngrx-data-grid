import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridRowComponent } from '@grid/components/grid-row/grid-row.component';
import { NO_ERRORS_SCHEMA, Renderer2, Type } from '@angular/core';

class MockCell {
}

class MockText {
}

describe('GridRowComponent', () => {
  let fixture: ComponentFixture<GridRowComponent>;
  let component: GridRowComponent;
  let renderer2: Renderer2;

  const expectedDataAndConfig = [{
    config: {
      headerName: 'id',
      field: 'userId',
      component: MockCell,
      isVisible: false,
      sortable: true
    },
    data: 'd66f8066-547f-41ff-b9b8-ae3a0e10705d'
  }, {
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCell,
      isVisible: false,
      sortable: true
    },
    data: 'uzimmerman0@goo.gl'
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockText,
      isVisible: false,
      sortable: true
    },
    data: 43
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridRowComponent],
      providers: [{
        provide: Renderer2,
        useValue: {
          setStyle: jasmine.createSpy('setStyle')
        }
      }],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(GridRowComponent);

    component = fixture.componentInstance;
    component.dataAndConfig = expectedDataAndConfig;
    component.gridCellChildren = <any>{
      toArray: jasmine.createSpy('toArray').and.returnValue([{nativeElement: {}}])
    };
    component.componentFactories = <any>[{
      componentType: {
        name: 'MockCell'
      }
    }, {
      componentType: {
        name: 'MockCell'
      }
    }];

    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return component factory', () => {
    // then
    expect(component.getComponent(<any>{
      component: MockCell
    })).toEqual(<any>{
      componentType: {
        name: 'MockCell'
      }
    });
  });

  it('should invoke setStyle and toArray', () => {
    // given
    spyOn(renderer2, 'setStyle');

    // when
    component.ngAfterViewInit();

    // then
    expect(renderer2.setStyle).toHaveBeenCalled();
    expect(component.gridCellChildren.toArray).toHaveBeenCalled();
  });
});
