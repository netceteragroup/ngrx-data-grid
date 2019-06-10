import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CellRowComponent } from '@grid/components/cell-row/cell-row.component';
import { NO_ERRORS_SCHEMA, Renderer2, Type } from '@angular/core';

class MockCell {
}

class MockText {
}

describe('CellRowComponent', () => {
  let fixture: ComponentFixture<CellRowComponent>;
  let component: CellRowComponent;
  let renderer2: Renderer2;
  const expectedDataAndConfig = [{
    config: {
      headerName: 'id',
      field: 'userId',
      component: MockCell,
      isVisible: false
    },
    data: 'd66f8066-547f-41ff-b9b8-ae3a0e10705d'
  }, {
    config: {
      headerName: 'mail',
      field: 'mail',
      component: MockCell,
      isVisible: false
    },
    data: 'uzimmerman0@goo.gl'
  }, {
    config: {
      headerName: 'age',
      field: 'age',
      component: MockText,
      isVisible: false
    },
    data: 43
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellRowComponent],
      providers: [{
        provide: Renderer2,
        useValue: {
          setStyle: jasmine.createSpy('setStyle'),
          addClass: jasmine.createSpy('addClass')
        }
      }],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(CellRowComponent);
    component = fixture.componentInstance;
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component.dataAndConfig = expectedDataAndConfig;

    component.cellHost = <any>{
      clear: jasmine.createSpy('clear'),
      createComponent: jasmine.createSpy('createComponent').and.returnValue({
        instance: { },
        location: {
          nativeElement: {
            querySelector: jasmine.createSpy('querySelector').and.returnValue({
              querySelector: jasmine.createSpy('querySelector')
            })
          }
        }
      })
    };

    component.componentFactories = <any>{
      componentType: jasmine.createSpy('componentType').and.returnValue({
        name: jasmine.createSpy('name').and.returnValues('MockCell', 'MockText')
      }),
      find: jasmine.createSpy('find').and.returnValues(MockCell, MockText)
    };
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call clear, find, setStyle and addClass', () => {
    // given
    spyOn(renderer2, 'addClass');
    spyOn(renderer2, 'setStyle');

    // when
    component.ngOnInit();

    // then
    expect(component.componentFactories.find).toHaveBeenCalled();
    expect(component.cellHost.clear).toHaveBeenCalled();
    expect(component.cellHost.createComponent).toHaveBeenCalledWith(MockCell);
    expect(component.cellHost.createComponent).toHaveBeenCalledWith(MockText);
    expect(renderer2.addClass).toHaveBeenCalled();
    expect(renderer2.setStyle).toHaveBeenCalled();
  });
});
