import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColumnResizeTriggerDirective } from './column-resize-trigger.directive';
import { EventTypes } from '../models/event-types';
import { ColumnResizeDirective } from './column-resize.directive';

@Component({
  template: `
    <div ngrxColumnResizeTrigger></div>`
})
class TestComponent {
}

describe('ColumnResizeTriggerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let resizeTriggerElement: DebugElement;
  const columnResizeDirective = {
    onMouseDown: jasmine.createSpy('onMouseDown')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColumnResizeTriggerDirective,
        TestComponent
      ],
      providers: [
        {
          provide: ColumnResizeDirective,
          useValue: columnResizeDirective
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    resizeTriggerElement = fixture.debugElement.query(By.css('div'));
  });

  it('should trigger column resize on mouse down', () => {
    // when
    resizeTriggerElement.triggerEventHandler(EventTypes.MouseDown, {});
    fixture.detectChanges();

    // then
    expect(columnResizeDirective.onMouseDown).toHaveBeenCalled();
  });
});
