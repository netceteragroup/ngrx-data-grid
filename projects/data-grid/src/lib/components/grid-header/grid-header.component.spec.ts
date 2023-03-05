import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridHeaderComponent } from './grid-header.component';
import { GridConfigBuilder } from "../../config";

describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridHeaderComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(GridHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set drag disabled to true', () => {
    component.config=  GridConfigBuilder.gridConfig()
      .withColumnReorder(false);

    expect(component.dragDisabled).toEqual(true);
  });

  it('should set drag disabled to false', () => {
    component.config=  GridConfigBuilder.gridConfig()
      .withColumnReorder(true);

    expect(component.dragDisabled).toEqual(false);
  });
});
