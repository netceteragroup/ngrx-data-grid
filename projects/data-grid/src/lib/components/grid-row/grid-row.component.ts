import { Component, EventEmitter, Input, Output } from '@angular/core';
import { columnValueResolver, DataGridColumnWithId } from '../../models';

@Component({
  selector: 'ngrx-grid-row',
  templateUrl: 'grid-row.component.html',
  styleUrls: ['./grid-row.component.scss']
})
export class GridRowComponent {
  @Input() data: any;
  @Input() columns: DataGridColumnWithId[];
  @Input() isSelected: boolean;
  @Input() rowIndex: number;
  @Output() toggleRow = new EventEmitter();

  trackByIndex(_, index) {
    return index;
  }

  getColumnData(column: DataGridColumnWithId) {
    return columnValueResolver(column)(this.data);
  }

  toggleRowSelection() {
    this.toggleRow.emit();
  }

}
