import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { toLower } from 'ramda';

@Component({
  selector: 'app-traffic-light',
  template: '',
  styleUrls: ['./traffic-light.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrafficLightComponent implements OnInit {
  @Input() progressStatus: any;
  @Input() extended = false;

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    const progressStatusClass = `progress-status-${toLower(this.progressStatus.id)}`;
    this.renderer.addClass(this.element.nativeElement, progressStatusClass);

    if (this.extended) {
      this.renderer.addClass(this.element.nativeElement, 'extended');
    }
  }

}
