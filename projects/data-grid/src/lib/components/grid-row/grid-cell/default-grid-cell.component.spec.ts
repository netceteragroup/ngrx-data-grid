import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultGridCellComponent } from './default-grid-cell.component';

describe('DefaultGridCellComponent', () => {
  let fixture: ComponentFixture<any>;
  let component: DefaultGridCellComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultGridCellComponent]
    });
    fixture = TestBed.createComponent(DefaultGridCellComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});
