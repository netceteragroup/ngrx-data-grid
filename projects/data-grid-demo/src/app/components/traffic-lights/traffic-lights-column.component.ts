import { Component, Input } from '@angular/core';
import { GridCell } from 'ngrx-data-grid';

@Component({
  templateUrl: './traffic-lights-column.component.html'
})
export class TrafficLightsColumnComponent implements GridCell<any> {
  @Input() data: any;

}
