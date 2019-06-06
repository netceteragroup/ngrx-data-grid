import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: 'price.component.html'
})
export class PriceComponent {
  @Input() data: any;
}
