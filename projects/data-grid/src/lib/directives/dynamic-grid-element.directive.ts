import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { asyncScheduler, fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { DomHandler } from 'projects/data-grid/src/lib/util/dom-handler';

export interface DynamicElementPosition {
  top: number;
  left: number;
}

/**
 * Directive that appends the host element which is part of the grid on the document body and displays it on the position provided.
 */
@Directive({
  selector: '[ngrxDynamicGridElement]'
})
export class DynamicGridElementDirective implements OnInit, OnDestroy {
  /*
  Default space to the element.
   */
  private static readonly DEFAULT_LEFT_SPACING = 30;

  constructor(private el: ElementRef,
              private renderer: Renderer2) {
  }

  @Input() position: DynamicElementPosition;

  private container: HTMLElement;
  private scrollMovementSubscription: Subscription;

  private startingLeftPosition: number;
  private startingScrollValue: number;

  private static getParentGridContainer(): HTMLElement {
    return document.querySelector('.grid');
  }

  ngOnInit(): void {
    this.create();
    this.subscribeScrollMovement();
  }

  private create(): void {
    this.container = this.renderer.createElement('div');

    this.renderer.appendChild(this.container, this.el.nativeElement);

    this.startingScrollValue = DomHandler.getScrollLeftValue(DynamicGridElementDirective.getParentGridContainer());
    this.startingLeftPosition = this.position.left + DynamicGridElementDirective.DEFAULT_LEFT_SPACING;

    this.renderer.setStyle(this.container, DomHandler.POSITION_STYLE_PROPERTY, 'absolute');
    this.renderer.setStyle(this.container, DomHandler.POSITION_TOP_STYLE_PROPERTY, DomHandler.toPx(this.position.top));
    this.renderer.setStyle(this.container, DomHandler.POSITION_LEFT_STYLE_PROPERTY, DomHandler.toPx(this.startingLeftPosition));
    this.renderer.appendChild(document.body, this.container);
  }

  private subscribeScrollMovement(): void {
    // listen grid container scroll event
    this.scrollMovementSubscription = fromEvent(DynamicGridElementDirective.getParentGridContainer(), DomHandler.SCROLL_EVENT).pipe(
      throttleTime(DomHandler.DEFAULT_SCROLL_THROTTLE_TIME, asyncScheduler, {leading: false, trailing: true})
    ).subscribe((event: Event) => this.adjustHorizontalPosition(event));
  }

  private adjustHorizontalPosition(event: Event): void {
    if (this.container) {
      const newHorizontalPosition = (this.startingLeftPosition + this.startingScrollValue) - DomHandler.getScrollLeftValue(event.target);
      this.renderer.setStyle(this.container, DomHandler.POSITION_LEFT_STYLE_PROPERTY, DomHandler.toPx(newHorizontalPosition));
    }
  }

  ngOnDestroy(): void {
    this.remove();
  }

  private remove(): void {
    if (this.container && this.container.parentElement) {
      this.renderer.removeChild(document.body, this.container);
    }

    this.unsubscribeScrollMovement();
    this.container = null;
    this.renderer.destroy();
  }

  private unsubscribeScrollMovement(): void {
    this.scrollMovementSubscription.unsubscribe();
  }

}
