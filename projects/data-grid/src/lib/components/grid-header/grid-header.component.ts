import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataGridColumnWithId, GridDataFilterWithColumnId, GridDataSortWithColumnId } from '../../models';

@Component({
  selector: 'ngrx-grid-header',
  templateUrl: 'grid-header.component.html',
  styleUrls: ['grid-header.component.scss']
})
export class GridHeaderComponent {
  @Input() columns: DataGridColumnWithId[];
  @Input() checkboxSelection = false;

  @Output() sortGrid: EventEmitter<GridDataSortWithColumnId> = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid: EventEmitter<GridDataFilterWithColumnId> = new EventEmitter<GridDataFilterWithColumnId>();
  @Output() toggleSelectAllRows = new EventEmitter();

  allRowsSelected = false;

  trackByIndex(_, index) {
    return index;
  }

  onToggleSelectAllRows() {
    this.allRowsSelected = !this.allRowsSelected;
    this.toggleSelectAllRows.emit(this.allRowsSelected);
  }

}
