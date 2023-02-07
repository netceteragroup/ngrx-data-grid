import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CdkOverlayOrigin, ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay } from '@angular/cdk/overlay';
import * as R from 'ramda';

@Directive({
  selector: 'ngrx-dynamic-filter[ngrxDynamicFilterPosition]'
})
export class DynamicFilterPositionDirective implements OnInit {
  @Input() overlayOrigin: CdkOverlayOrigin;
  @Input() sortOrder: number;

  @Output() positionStrategyChanged = new EventEmitter<FlexibleConnectedPositionStrategy>();

  readonly DEFAULT_POSITION = {originX: "end", originY: "bottom", overlayX: "end", overlayY: "bottom", offsetY: -25};

  constructor(protected readonly filterElement: ElementRef, private overlay: Overlay) {
  }

  ngOnInit() {
   this.updatePositionStrategy();
  }

  private updatePositionStrategy() {
    return setTimeout(() => {
      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(this.getElementRef(this.overlayOrigin))
        .withPositions([this.calculatePosition()])

      this.positionStrategyChanged.emit(positionStrategy);
    }, 0);
  }

  private calculatePosition() {
    const originElement = R.compose(this.getNativeElement, this.getElementRef)(this.overlayOrigin as CdkOverlayOrigin);
    const originOffsetWidth = this.getOffsetWidth(originElement);
    const originOffsetLeft = this.getOffsetLeft(originElement);
    const originTotalWidth = originOffsetWidth + originOffsetLeft;
    const filterOffsetWidth = R.compose(this.getOffsetWidth, this.getNativeElement)(this.filterElement);

    const offsetX = this.sortOrder == 0 && originTotalWidth < filterOffsetWidth
      ? R.negate(originOffsetWidth)
      : R.negate(filterOffsetWidth);

    return {...this.DEFAULT_POSITION, offsetX} as ConnectedPosition;
  }

  private getNativeElement(elementRef: ElementRef) {
    return R.prop('nativeElement', elementRef);
  }

  private getElementRef(view: CdkOverlayOrigin) {
    return R.prop('elementRef', view);
  }

  private getOffsetWidth(element: ElementRef | Element) {
    return R.prop('offsetWidth', element);
  }

  private getOffsetLeft(element: ElementRef | Element) {
    return R.prop('offsetLeft', element);
  }
}
