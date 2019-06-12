import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: 'price.component.html',
  styleUrls: ['price.component.css']
})
export class PriceComponent {
  @Input() data: any;
}
