import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId } from '../../models';
import { SelectionType } from '../../config';
import { isCheckboxSelection } from '../../util/selection';

@Component({
  selector: 'ngrx-grid-header',
  templateUrl: 'grid-header.component.html',
  styleUrls: ['grid-header.component.scss']
})
export class GridHeaderComponent {
  @Input() columns: DataGridColumnWithId[];
  @Input() selectionType: SelectionType;
  @Input() allSelected = false;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();
  @Output() toggleSelectAllRows = new EventEmitter();

  trackByIndex(_, index) {
    return index;
  }

  onToggleSelectAllRows() {
    this.toggleSelectAllRows.emit(!this.allSelected);
  }

  hasCheckboxSelection() {
    return isCheckboxSelection(this.selectionType);
  }

}
