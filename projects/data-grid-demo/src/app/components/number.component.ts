import { Component, Input } from '@angular/core';
import { GridCell } from 'ngrx-data-grid';

@Component({
  selector: 'app-demo-number',
  templateUrl: 'number.component.html',
  styleUrls: ['number.component.scss']
})
export class NumberComponent implements GridCell<string | number> {
  @Input() data: string | number;
}
