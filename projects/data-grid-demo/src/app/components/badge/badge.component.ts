import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { toLower } from 'ramda';

@Component({
  selector: 'app-badge',
  template: '',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent implements OnInit {
  @Input() status: any;
  @Input() extended = false;

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    const statusClass = `status-${toLower(this.status.id)}`;
    this.renderer.addClass(this.element.nativeElement, statusClass);

    if (this.extended) {
      this.renderer.addClass(this.element.nativeElement, 'extended');
    }
  }

}
