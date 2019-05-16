import { TestBed } from '@angular/core/testing';
import { DisplayGridExampleComponent } from '@example/components/display-grid-example.component';

describe('DisplayGridExampleComponent', () => {

  let component: DisplayGridExampleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DisplayGridExampleComponent
      ]
    }).compileComponents();
    component = TestBed.createComponent(DisplayGridExampleComponent).componentInstance;
    spyOn(component.newColumnAdded, 'emit');
    spyOn(component.newRowAdded, 'emit');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when new row is added', () => {
    // when
    component.onAddNewRow();

    // then
    expect(component.newRowAdded.emit).toHaveBeenCalled();
  });

  it('should emit event when new column is added', () => {
    // when
    component.onAddNewColumn();

    // then
    expect(component.newColumnAdded.emit).toHaveBeenCalled();
  });

});
