import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId } from '../../models';
import { GridConfig } from '../../config';
import { ColumnResizeEvent } from '../../models/column-resize-event';

@Component({
  selector: 'ngrx-grid-header',
  templateUrl: 'grid-header.component.html',
  styleUrls: ['grid-header.component.scss']
})
export class GridHeaderComponent {
  @Input() columns: DataGridColumnWithId[];
  @Input() config: GridConfig;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();
  @Output() columnResizing = new EventEmitter<ColumnResizeEvent>();
  @Output() columnResized = new EventEmitter<ColumnResizeEvent>();

  trackByIndex(_, index) {
    return index;
  }

  get dragDisabled() {
    return !this.config.columnReorder;
  }
}
