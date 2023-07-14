import { Component, Input } from '@angular/core';
import { GridCell } from '../../../models';

@Component({
  templateUrl: './default-grid-cell.component.html',
  styleUrls: ['default-grid-cell.component.scss']
})
export class DefaultGridCellComponent implements GridCell {
  @Input() data: any;
  @Input() row: any;
}
