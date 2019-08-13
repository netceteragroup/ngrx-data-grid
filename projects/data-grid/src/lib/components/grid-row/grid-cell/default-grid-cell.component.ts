import { Component, Input } from '@angular/core';
import { GridCell } from '../../../models';

@Component({
  template: 'default-grid-cell.component.html',
  styleUrls: ['default-grid-cell.component.scss']
})
export class DefaultGridCellComponent implements GridCell<any> {
  @Input() data: any;
}
