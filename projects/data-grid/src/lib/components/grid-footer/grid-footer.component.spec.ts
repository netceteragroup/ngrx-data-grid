import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridFooterComponent } from './grid-footer.component';

describe('GridFooterComponent', () => {
  let component: GridFooterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridFooterComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    component = TestBed.createComponent(GridFooterComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
