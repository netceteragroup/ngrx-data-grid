/**
 * Utility class for handling DOM events and properties.
 */
export class DomHandler {
  static readonly POSITION_STYLE_PROPERTY = 'position';
  static readonly POSITION_TOP_STYLE_PROPERTY = 'top';
  static readonly POSITION_LEFT_STYLE_PROPERTY = 'left';

  static readonly SCROLL_EVENT = 'scroll';
  static readonly DEFAULT_SCROLL_THROTTLE_TIME = 30;

  static toPx(value: number): string {
    return `${value}px`;
  }

  static getScrollLeftValue(parentElement: any): number {
    return (window.pageXOffset || parentElement.scrollLeft) - (parentElement.clientLeft || 0);
  }
}
