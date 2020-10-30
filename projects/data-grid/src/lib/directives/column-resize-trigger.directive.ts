import { Directive, HostListener } from '@angular/core';
import { ColumnResizeDirective } from './column-resize.directive';
import { EventTypes } from '../models/event-types';

@Directive({
  selector: '[ngrxColumnResizeTrigger]'
})
export class ColumnResizeTriggerDirective {

  constructor(
    private columnResizeDirective: ColumnResizeDirective
  ) {
  }

  @HostListener(EventTypes.MouseDown, ['$event'])
  onMousedown(event: MouseEvent) {
    this.columnResizeDirective.onMouseDown(event);
  }
}
