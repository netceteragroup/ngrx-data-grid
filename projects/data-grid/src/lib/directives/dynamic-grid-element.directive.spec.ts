import { DynamicGridElementDirective } from './dynamic-grid-element.directive';
import { TestBed } from '@angular/core/testing';
import { ElementRef, Renderer2 } from '@angular/core';
import { DomHandler } from 'projects/data-grid/src/lib/util/dom-handler';

describe('DynamicGridElementDirective', () => {
  let directive: DynamicGridElementDirective;
  let renderer: Renderer2;
  let containerElement: HTMLElement;
  let grid: HTMLElement;
  const hostElementHTML = `<div>Grid element</div>`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DynamicGridElementDirective,
        {
          provide: ElementRef,
          useValue: {
            nativeElement: hostElementHTML
          }
        },
        {
          provide: Renderer2,
          useValue: {
            createElement: () => {
            },
            appendChild: () => {
            },
            setStyle: () => {
            }
          }
        }
      ]
    });
    directive = TestBed.get(DynamicGridElementDirective);
    renderer = TestBed.get(Renderer2);
    containerElement = document.createElement('div');
    grid = document.createElement('div');
    spyOn(renderer, 'appendChild');
    spyOn(renderer, 'setStyle');
    spyOn(document, 'querySelector').and.returnValue(grid);
    spyOn(renderer, 'createElement').and.returnValue(containerElement);
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });

  it('should create container element, set positions on the element and append the container to document body', () => {
    // given
    directive.position = {
      top: 10,
      left: 10
    };
    grid.scrollLeft = 0;

    // when
    directive.ngOnInit();

    // then
    expect(renderer.createElement).toHaveBeenCalledWith('div');
    expect(renderer.appendChild).toHaveBeenCalledWith(containerElement, hostElementHTML);
    expect(renderer.setStyle).toHaveBeenCalledWith(containerElement, DomHandler.POSITION_STYLE_PROPERTY, 'absolute');
    expect(renderer.setStyle).toHaveBeenCalledWith(containerElement, DomHandler.POSITION_TOP_STYLE_PROPERTY, '10px');
    expect(renderer.setStyle).toHaveBeenCalledWith(containerElement, DomHandler.POSITION_LEFT_STYLE_PROPERTY, '40px');
    expect(renderer.appendChild).toHaveBeenCalledWith(document.body, containerElement);
  });

});
