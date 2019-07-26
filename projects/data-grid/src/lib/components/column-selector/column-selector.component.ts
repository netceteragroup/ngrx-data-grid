import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { columnVisible, DataGridColumnWithId, getColumnId, headerName } from '../../models';

@Component({
  selector: 'ngrx-column-selector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['column-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnSelectorComponent {
  @Input() columns: DataGridColumnWithId[];
  @Output() toggleColumnVisibility = new EventEmitter<string>();

  expanded = false;

  get checkboxStyle() {
    return {display: this.expanded ? 'block' : 'none'};
  }

  trackByIndex(_, index) {
    return index;
  }

  getHeaderName(column) {
    return headerName(column);
  }

  getColumnId(column) {
    return getColumnId(column);
  }

  getColumnVisible(column) {
    return columnVisible(column);
  }

  onToggleColumn(column: DataGridColumnWithId) {
    this.toggleColumnVisibility.emit(this.getColumnId(column));
  }

  toggleColumns() {
    this.expanded = !this.expanded;
  }

}
