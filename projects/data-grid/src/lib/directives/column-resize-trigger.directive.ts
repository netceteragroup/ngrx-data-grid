import { Directive, HostListener } from '@angular/core';
import { ColumnResizeDirective } from './column-resize.directive';

@Directive({
  selector: '[ngrxColumnResizeTrigger]'
})
export class ColumnResizeTriggerDirective {

  constructor(
    private columnResizeDirective: ColumnResizeDirective
  ) {
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.columnResizeDirective.onMouseDown(event);
  }
}
