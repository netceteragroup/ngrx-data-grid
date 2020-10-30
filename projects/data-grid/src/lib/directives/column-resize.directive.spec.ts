import { Component, ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColumnResizeDirective } from './column-resize.directive';
import { GridHeaderItemComponent } from '../components/grid-header/grid-header-item.component';
import { DynamicGridHeaderItemComponent } from '../components/grid-header/dynamic-grid-header-item.component';
import * as R from 'ramda';

@Component({
  template: `
    <ngrx-grid-header-item [column]="column"
                           (columnResizing)="columnResizing.emit($event)"
                           (columnResized)="columnResized.emit($event)"
                           ngrxColumnResize>
      <ngrx-dynamic-grid-header-item [column]="column"></ngrx-dynamic-grid-header-item>
      <div id="trigger" ngrxColumnResizeTrigger></div>
    </ngrx-grid-header-item>`
})
class TestComponent {
  columnResizing = {
    emit: jasmine.createSpy('columnResizing')
  };
  columnResized = {
    emit: jasmine.createSpy('columnResized')
  };

  column = {
    columnId: 'id-0',
    field: 'id',
    headerName: 'id',
    visible: true,
    sortAvailable: true,
    filterAvailable: true,
    width: 754
  };
}

describe('ColumnResizeDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let columnResizeDirective: ColumnResizeDirective;
  const elementMock = {};

  const mockEvent = (positionX: number) => ({
    preventDefault: jasmine.createSpy('preventDefault'),
    stopPropagation: jasmine.createSpy('stopPropagation'),
    x: positionX
  } as any as MouseEvent);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColumnResizeDirective,
        GridHeaderItemComponent,
        DynamicGridHeaderItemComponent,
        TestComponent
      ],
      providers: [
        {
          provide: ElementRef,
          useValue: elementMock
        },
        Renderer2
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    const columnResizeDirectiveEl = fixture.debugElement.query(By.directive(ColumnResizeDirective));
    columnResizeDirective = columnResizeDirectiveEl.injector.get(ColumnResizeDirective);

    fixture.detectChanges();
  });

  it('should decrease column width on mouse move', () => {
    // when
    columnResizeDirective.onMouseDown(mockEvent(1000));
    const initialWidth = columnResizeDirective.column.width;
    columnResizeDirective.onMouseMove(mockEvent(900));

    // then
    const expectedColumn = R.mergeRight(columnResizeDirective.column, {width: initialWidth - 100});
    expect(component.columnResizing.emit).toHaveBeenCalledWith(expectedColumn);
    expect(component.columnResized.emit).not.toHaveBeenCalled();
  });

  it('should increase column width on mouse move', () => {
    // when
    columnResizeDirective.onMouseDown(mockEvent(1000));
    const initialWidth = columnResizeDirective.column.width;
    columnResizeDirective.onMouseMove(mockEvent(1100));

    // then
    const expectedColumn = R.mergeRight(columnResizeDirective.column, {width: initialWidth + 100});
    expect(component.columnResizing.emit).toHaveBeenCalledWith(expectedColumn);
    expect(component.columnResized.emit).not.toHaveBeenCalled();
  });

  it('should set minimal column width', () => {
    // when
    columnResizeDirective.onMouseDown(mockEvent(1000));
    const initialWidth = columnResizeDirective.column.width;
    columnResizeDirective.onMouseMove(mockEvent(1000 - initialWidth));

    // then
    const expectedColumn = R.mergeRight(columnResizeDirective.column, {width: columnResizeDirective.minColumnWidth});
    expect(component.columnResizing.emit).toHaveBeenCalledWith(expectedColumn);
    expect(component.columnResized.emit).not.toHaveBeenCalled();
  });

  it('should resize column width on mouse up', () => {
    // when
    columnResizeDirective.onMouseDown(mockEvent(1000));
    const initialWidth = columnResizeDirective.column.width;
    columnResizeDirective.onMouseUp(mockEvent(1100));

    // then
    const expectedColumn = R.mergeRight(columnResizeDirective.column, {width: initialWidth + 100});
    expect(component.columnResized.emit).toHaveBeenCalledWith(expectedColumn);
    expect(component.columnResizing.emit).not.toHaveBeenCalled();
  });
});
