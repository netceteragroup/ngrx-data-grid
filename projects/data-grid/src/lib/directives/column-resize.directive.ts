import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DataGridColumnWithId, HEADER_NAME_ID } from '../models';
import * as R from 'ramda';
import { EventTypes } from '../models/event-types';
import { EventTargetTypes } from '../models/event-target-types';
import { ColumnResizeEvent } from '../models/column-resize-event';
import { MIN_HEADER_NAME_WIDTH } from '../util/columns-style';

@Directive({
  selector: '[ngrxColumnResize]'
})
export class ColumnResizeDirective implements AfterViewInit {
  @Input() column: DataGridColumnWithId;

  @Output() readonly columnResizing = new EventEmitter<ColumnResizeEvent>();
  @Output() readonly columnResized = new EventEmitter<ColumnResizeEvent>();

  columnInResizeMode = false;
  resizeStartPositionX: number;
  minColumnWidth: number;
  currentWidth: number;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngAfterViewInit(): void {
    this.minColumnWidth = this.calculateMinColumnWidth();
  }

  get element() {
    return this.elementRef.nativeElement;
  }

  get elementWidth() {
    return this.element.getBoundingClientRect().width;
  }

  onMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.columnInResizeMode = true;
    this.resizeStartPositionX = event.x;
    this.currentWidth = this.elementWidth;
    this.registerMouseEvents();
  }

  onMouseUp(event: MouseEvent) {
    event.stopPropagation();
    if (this.columnInResizeMode) {
      this.columnResized.emit(this.getColumnResizeEventData(event.x));
      this.columnInResizeMode = false;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.columnInResizeMode) {
      this.columnResizing.emit(this.getColumnResizeEventData(event.x));
    }
  }

  private registerMouseEvents() {
    const unregisterMouseMove = this.renderer.listen(EventTargetTypes.Document, EventTypes.MouseMove, (mouseMoveEvent: MouseEvent) => {
      this.onMouseMove(mouseMoveEvent);
    });

    const unregisterContextMenu = this.renderer.listen(EventTargetTypes.Document, EventTypes.ContextMenu, (contextmenu: MouseEvent) => {
      contextmenu.preventDefault();
    });

    const unregisterMouseUp = this.renderer.listen(EventTargetTypes.Document, EventTypes.MouseUp, (mouseUpEvent: MouseEvent) => {
      this.onMouseUp(mouseUpEvent);
      unregisterMouseUp();
      unregisterMouseMove();
      unregisterContextMenu();
    });
  }

  private getColumnResizeEventData(currentPositionX: number): ColumnResizeEvent {
    return {columnId: this.column.columnId, width: this.calculateColumnWidth(currentPositionX)};
  }

  private calculateColumnWidth(currentPositionX: number) {
    const width = this.currentWidth - Number(this.resizeStartPositionX - currentPositionX);
    return R.lt(width, this.minColumnWidth) ? this.minColumnWidth : width;
  }

  private calculateMinColumnWidth() {
    return Number((R.sum(this.getChildrenWidth())).toFixed(0));
  }

  private getChildrenWidth() {
    return R.map(child => child?.id === HEADER_NAME_ID
      ? MIN_HEADER_NAME_WIDTH
      : child.getBoundingClientRect()?.width,
      R.head(this.element?.children)?.children);
  }
}
