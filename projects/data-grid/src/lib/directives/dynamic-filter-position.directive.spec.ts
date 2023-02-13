import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFilterPositionDirective } from './dynamic-filter-position.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { ButtonComponent } from '../components/button/button.component';

@Component({
  template: `
    <ng-container>
      <ngrx-button
        cdkOverlayOrigin
        #originOverlay="cdkOverlayOrigin"
        class="ms-auto flex-direction-column btn-plain"
        [ngStyle]="originWidthStyle"
        buttonStyle="plain">Toggle</ngrx-button>

      <ng-template cdkConnectedOverlay
                   [cdkConnectedOverlayOrigin]="originOverlay"
                   [cdkConnectedOverlayOpen]="open">
        <ngrx-dynamic-filter
          ngrxDynamicFilterPosition
          [ngStyle]="overlayWidthStyle"
          [overlayOrigin]="originOverlay"
          [filterSequence]="position"
          (positionStrategyChanged)="onPositionChange($event)">
        </ngrx-dynamic-filter>
      </ng-template>
    </ng-container>
  `
})
class TestComponent {
  @ViewChild(DynamicFilterPositionDirective) filterPositionDirective: DynamicFilterPositionDirective;

  open = false;
  position = 0;
  width = 400;
  overlayWidth = 240;

  get originWidthStyle() {
    return {'display': 'block', 'width': `${this.width}px`};
  }

  get overlayWidthStyle() {
    return {'display': 'block', 'width': `${this.overlayWidth}px`};
  }

  onPositionChange(_) {
  }
}

describe('DynamicFilterPositionDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        DynamicFilterPositionDirective,
        TestComponent
      ],
      providers: [
        DynamicFilterPositionDirective
      ],
      imports: [OverlayModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    });

  it('should calculate position of first filter element when is open, and origin has bigger width than filter', (done) => {
    // when
    component.open = true;
    fixture.detectChanges();
    spyOn(component.filterPositionDirective.positionStrategyChanged, 'emit').and.callThrough();

    // then
    fixture.whenStable().then(() => {
      expect(component.filterPositionDirective).toBeDefined();
      expect(component.filterPositionDirective.positionStrategyChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        positions: [{
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -33,
          offsetX: (-1)*component.overlayWidth
        }]
      }));
      done();
    });
  });

  it('should calculate position of second filter element when is open, and origin has bigger width than filter', (done) => {
    // when
    component.open = true;
    component.position = 1;
    fixture.detectChanges();
    spyOn(component.filterPositionDirective.positionStrategyChanged, 'emit').and.callThrough();

    // then
    fixture.whenStable().then(() => {
      expect(component.filterPositionDirective).toBeDefined();
      expect(component.filterPositionDirective.positionStrategyChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        positions: [{
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -33,
          offsetX: (-1)*component.overlayWidth
        }]
      }));
      done();
    });
  });

  it('should calculate position of first filter element when is open, and origin has smaller width than filter', (done) => {
    // when
    component.open = true;
    component.width = 100;
    fixture.detectChanges();
    spyOn(component.filterPositionDirective.positionStrategyChanged, 'emit').and.callThrough();

    // then
    fixture.whenStable().then(() => {
      expect(component.filterPositionDirective).toBeDefined();
      expect(component.filterPositionDirective.positionStrategyChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        positions: [{
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -33,
          offsetX: (-1)*component.width
        }]
      }));
      done();
    });
  });

  it('should calculate position of second filter element when is open, and origin has smaller width than filter', (done) => {
    // when
    component.open = true;
    component.position = 1;
    component.width = 100;
    fixture.detectChanges();
    spyOn(component.filterPositionDirective.positionStrategyChanged, 'emit').and.callThrough();

    // then
    fixture.whenStable().then(() => {
      expect(component.filterPositionDirective).toBeDefined();
      expect(component.filterPositionDirective.positionStrategyChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        positions: [{
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -33,
          offsetX: (-1) * component.overlayWidth
        }]
      }));
      done();
    });
  });

  it('should not calculate position when filter element is closed', (done) => {
    // when
    component.open = false;
    fixture.detectChanges();

    // then
    fixture.whenStable().then(() => {
      expect(component.filterPositionDirective).not.toBeDefined();
      done();
    });
  });

});
