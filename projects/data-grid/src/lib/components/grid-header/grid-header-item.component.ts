import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  columnFilter,
  columnFilterAvailable,
  columnSortAvailable, columnSortType,
  DataGridColumn, filterApplied, FilterCondition, FilteringOptions, getColumnId,
  GridDataFilterWithColumnId,
  GridDataSortWithColumnId,
  headerName, sortAscending, sortDescending, SortType
} from '../../models';
import { hasNoValue } from '../../util/type';

@Component({
  selector: 'ngrx-grid-header-item',
  templateUrl: 'grid-header-item.component.html',
  styleUrls: ['grid-header-item.component.scss']
})
export class GridHeaderItemComponent {
  @Input() column: DataGridColumn;

  @Output() sortGrid: EventEmitter<GridDataSortWithColumnId> = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid: EventEmitter<GridDataFilterWithColumnId> = new EventEmitter<GridDataFilterWithColumnId>();

  filterExpanded = false;

  get headerName() {
    return headerName(this.column);
  }

  get sortAvailable() {
    return columnSortAvailable(this.column);
  }

  get filterAvailable() {
    return columnFilterAvailable(this.column);
  }

  get columnId() {
    return getColumnId(this.column);
  }

  get filter() {
    return columnFilter(this.column);
  }

  get filterType() {
    return this.filter && this.filter.filterType;
  }

  get filterCondition() {
    return this.filter && (this.filter.condition || {option: FilteringOptions.None, value: null});
  }

  get sortType() {
    return columnSortType(this.column);
  }

  get filterExpandedStyle() {
    return {display: this.filterExpanded ? 'block' : 'none'};
  }

  get downCaretStyle() {
    return {'border-top': sortDescending(this.sortType) ? '5px solid rgba(16, 46, 84, 0.8)' : null};
  }

  get upCaretStyle() {
    return {'border-bottom': sortAscending(this.sortType) ? '5px solid rgba(16, 46, 84, 0.8)' : null};
  }

  get isFiltered() {
    return {'background-color': filterApplied(this.filter) ? `#37c662` : null};
  }

  toggleExpanded() {
    this.filterExpanded = !this.filterExpanded;
  }

  onApplySort() {
    if (this.sortAvailable) {
      const updatedSortType = hasNoValue(this.sortType) ? SortType.Descending : sortAscending(this.sortType) ? null : SortType.Ascending;
      this.sortGrid.emit({sortType: updatedSortType, columnId: this.columnId});
    }
  }

  onApplyFilter(filterCondition: FilterCondition) {
    if (this.filterAvailable) {
      this.filterGrid.emit({columnId: this.columnId, condition: filterCondition, filterType: this.filterType});
    }
  }
}
