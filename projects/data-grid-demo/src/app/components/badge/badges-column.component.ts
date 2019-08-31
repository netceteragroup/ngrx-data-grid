import { Component, Input } from '@angular/core';
import { GridCell } from 'ngrx-data-grid';

@Component({
  templateUrl: './badges-column.component.html'
})
export class BadgesColumnComponent implements GridCell<any> {
  @Input() data: any;

}
